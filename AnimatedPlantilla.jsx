import { StyleSheet, View, Animated, TouchableOpacity, Text, TextInput } from 'react-native'
import { useRef, useEffect } from 'react'
import useColors from '../Utils/Colors'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'

const NameStep = () => {

  const navigation = useNavigation()
  const Colors = useColors()

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const styles = DynamicStyles(Colors)

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Opacidad final
      duration: 1000, // Duración en milisegundos
      useNativeDriver: true, // Mejora el rendimiento
    }).start();
  }, [])

  function handleNext () {
      //if (email == "" || pass == "" || name == "") {
      //    Toast.show({
      //      type: 'error',
      //      text1: 'Rellene todos los campos',
      //      visibilityTime: 2000, 
      //      autoHide: true,
      //    }); return; }
  
      Animated.timing(fadeAnim, {
        toValue: 1, // Opacidad final
        duration: 500, // Duración en milisegundos
        useNativeDriver: true, // Mejora el rendimiento
      }).start();
  
      setTimeout(() => {
        next()
      }, 500)
    }
  
  return (
    <Animated.View style={{backgroundColor:Colors.background, flex:1, padding:10}}>

    </Animated.View>
  )
}

export default NameStep

const DynamicStyles = (Colors) => StyleSheet.create({

  text: {
      color:Colors.text,
      fontFamily:"Lato-Regular"
  }

})