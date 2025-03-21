import { StyleSheet, View, Animated, TouchableOpacity, Text, TextInput } from 'react-native'
import { useRef, useEffect } from 'react'
import useColors from '../../Utils/Colors'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'

const NameStep = ({email, setEmail, pass, setPass, name, setName, next}) => {

  const navigation = useNavigation()
  const Colors = useColors()
  const styles = DynamicStyles(Colors)

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Opacidad final
      duration: 700, // Duración en milisegundos
      useNativeDriver: true, // Mejora el rendimiento
    }).start();
  }, [])

  function handleNext () {
    if (email == "" || pass == "" || name == "") {
        Toast.show({
          type: 'error',
          text1: 'Rellene todos los campos',
          visibilityTime: 2000, 
          autoHide: true,
        }); return; }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Ingrese un email válido',
        visibilityTime: 2000,
        autoHide: true,
      }); return; }

    Animated.timing(fadeAnim, {
      toValue: 1, // Opacidad final
      duration: 700, // Duración en milisegundos
      useNativeDriver: true, // Mejora el rendimiento
    }).start();

    setTimeout(() => {
      next()
    }, 700)
  }
  
  return (
    <Animated.View style={{backgroundColor:Colors.background, flex:1, opacity:fadeAnim, padding:10}}>
      <Text style={styles.h1}>Cual es tu nombre?</Text>

      <View style={{alignItems:"center", marginBottom:150}}>
        <TextInput 
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder='Tu nombre'
          placeholderTextColor={Colors.placeholder}
          />
        <TextInput 
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder='Email'
          placeholderTextColor={Colors.placeholder}
          />
        <TextInput 
          style={styles.input}
          value={pass}
          onChangeText={(text) => setPass(text)}
          secureTextEntry
          placeholder='Contraseña'
          placeholderTextColor={Colors.placeholder}
          />
      </View>

      <View style={{alignItems:"center"}}>
        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>

    </Animated.View>
  )
}

export default NameStep

const DynamicStyles = (Colors) => StyleSheet.create({

  h1: {
    textAlign:"left",
    fontFamily:"Raleway-ExtraBold",
    fontSize:44,
    marginBottom:50,
    color:Colors.text
  },
  input: {
    width:329,
    height:59,
    borderColor:Colors.mainBlue,
    borderWidth:4,
    marginBottom:20,
    borderRadius:20,
    padding:12,
    fontSize:20,
    fontFamily:"Nunito-Bold",
    color:Colors.Text
  },
  button: {
    width:313,
    height:56,
    borderRadius:30,
    marginBottom:30,
    backgroundColor:Colors.yellow
  },
  buttonText: {
   fontSize:24,
   textAlign:"center",
   fontFamily:"Raleway-Bold",
   textAlignVertical:"center",
   height:"100%" 
  },

})