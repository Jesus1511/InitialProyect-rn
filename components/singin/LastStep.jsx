import { StyleSheet, View, Animated, TouchableOpacity, Text } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import useColors from '../../Utils/Colors';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

const LastStep = ({ location, setLocation, token, setToken, next, singing }) => {

  const navigation = useNavigation();
  const Colors = useColors();
  const styles = DynamicStyles(Colors);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [locationGranted, setLocationGranted] = useState(false);
  const [notificationGranted, setNotificationGranted] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const requestLocationPermission = async () => {
    if (locationGranted) return;
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const userLocation = await Location.getCurrentPositionAsync({});
      const reverseGeocode = await Location.reverseGeocodeAsync(userLocation.coords);
      
      if (reverseGeocode.length > 0) {
        const { city, region, country } = reverseGeocode[0];
        const locationData = {
          longitude: userLocation.coords.longitude,
          latitude: userLocation.coords.latitude,
          city: city || 'Desconocido',
          state: region || 'Desconocido',
          country: country || 'Desconocido'
        };
        console.log(locationData)
        setLocation(locationData);
      }
      
      setLocationGranted(true);
    } else {
      alert('Permiso de ubicación denegado');
    }
  };
  

  const requestNotificationPermission = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
  
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
  
    if (finalStatus !== 'granted') {
      alert('Permiso de notificaciones denegado');
      return;
    }
  
    try {
      const pushToken = await Notifications.getExpoPushTokenAsync();
      setToken(pushToken.data);
      setNotificationGranted(true);
    } catch (error) {
      console.error('Error obteniendo el token de notificación:', error);
    }
  };
  

  function handleNext() {
      next();
  }
  

  return (
    <Animated.View style={{ backgroundColor: Colors.background, flex: 1, padding: 10, opacity:fadeAnim }}>
      <Text style={styles.h1}>Una última cosa</Text>
      <View style={{ marginTop: 15, marginBottom: 50 }}>
        <TouchableOpacity
          style={[styles.blueButtons, { marginBottom: 6, backgroundColor: locationGranted ? 'gray' : "#537AD1"}]}
          onPress={requestLocationPermission}
          disabled={locationGranted}
        >
          <Text style={[styles.text, { color: 'white' }]}>
            {locationGranted ? 'Ubicación concedida ✅' : 'Autorizar acceso a tu ubicación para conocer a personas en tu zona'}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.text, { fontSize: 13, marginLeft: 10 }]}>Tu ubicación exacta permanecerá privada; otros usuarios solo sabrán que estás en la misma área.</Text>
      </View>
      <TouchableOpacity
        style={[styles.blueButtons, { marginBottom: 140, backgroundColor: notificationGranted ? 'gray' : "#537AD1" }]}
        onPress={requestNotificationPermission}
        disabled={notificationGranted}
      >
        <Text style={[styles.text, { color: 'white' }]}>
          {notificationGranted ? 'Notificaciones permitidas ✅' : 'Permitir notificaciones emergentes al interactuar con los usuarios.'}
        </Text>
      </TouchableOpacity>
      <Text style={[styles.text, { marginBottom: 40, marginLeft: 10 }]}>Puedes cambiar los permisos desde configuración cuando quieras</Text>

      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity onPress={handleNext} style={[styles.button, {backgroundColor:singing?"#b4b4b4":Colors.yellow}]}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default LastStep;



const DynamicStyles = (Colors) => StyleSheet.create({

  h1: {
    textAlign:"left",
    fontFamily:"Raleway-ExtraBold",
    fontSize:44,
    marginBottom:25,
    color:Colors.text
  },
  button: {
    width:313,
    height:56,
    borderRadius:30,
  },
  buttonText: {
   fontSize:24,
   textAlign:"center",
   fontFamily:"Raleway-Bold",
   textAlignVertical:"center",
   height:"100%" 
  },
  blueButtons: {
    width:319,
    height:69,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:20,
    elevation:10
  },
  text: {
    fontSize:16,
    fontFamily:"Raleway-Bold",
    color:Colors.text,
  }

})