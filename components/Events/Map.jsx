import React, { useState, useContext } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';
import useColors from '../../Utils/Colors';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../Navigation';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBeedqs4KJfOM0_fDdUpwYaNd5a1y8Fsmk';

const Map = ({ children, width, height, setLocation }) => {
  const { user } = useContext(UserContext);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const navigation = useNavigation();
  const Colors = useColors();
  const styles = DynamicStyles(Colors);

  const customMapStyle = [
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "poi.business", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "poi.business", elementType: "geometry", stylers: [{ visibility: "off" }] },
  ];

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude }); // Guardar la ubicación seleccionada

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;

        const getComponent = (types) =>
          addressComponents.find((component) =>
            component.types.some((type) => types.includes(type))
          )?.long_name || "";

        const locationData = {
          city: getComponent(["locality"]),
          state: getComponent(["administrative_area_level_1"]),
          country: getComponent(["country"]),
          latitude,
          longitude,
        };

        setLocation(locationData);
      }
    } catch (error) {
      console.error("Error obteniendo la ubicación:", error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={[styles.map, { width, height }]}
        provider={PROVIDER_GOOGLE}
        customMapStyle={customMapStyle}
        initialRegion={{
          latitude: user?.ubication.latitude,
          longitude: user?.ubication.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress} // Captura el toque en el mapa
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} title="Ubicación seleccionada" />
        )}
        {children}
      </MapView>
    </View>
  );
};

const DynamicStyles = (Colors) => StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Map;
