import React, { useState, useContext } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { View, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import useColors from '../../Utils/Colors';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../Navigation';

const Map = ({children, width, height}) => {

  const {user} = useContext(UserContext)

  const navigation = useNavigation();
  const Colors = useColors()
  const styles = DynamicStyles(Colors)

  const slideAnim = useState(new Animated.Value(200))[0];

  const customMapStyle = [
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "poi.business", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "poi.business", elementType: "geometry", stylers: [{ visibility: "off" }] },
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={[styles.map, {width, height}]}
        provider={PROVIDER_GOOGLE}
        customMapStyle={customMapStyle}
        initialRegion={{
          latitude: user?.ubication.latitude,
          longitude: user?.ubication.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {children}
      </MapView>
    </View>
  );
};

const DynamicStyles = (Colors) => StyleSheet.create({
  container: {
    flex: 1
  },
});

export default Map;
