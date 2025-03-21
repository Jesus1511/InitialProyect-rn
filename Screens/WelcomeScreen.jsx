import { StyleSheet, View, TouchableOpacity, StatusBar, Image, Text } from 'react-native'
import React from 'react'
import useColors from '../Utils/Colors'
import { useNavigation } from '@react-navigation/native'
import Carousel from '../components/Welcome/Corrousel'

import logo from '../assets/images/welcomeScreenLogo.png'

const WelcomeScreen = () => {

  const navigation = useNavigation()

  const Colors = useColors()
  const styles = DynamicStyles(Colors)

  return (
    <View style={{backgroundColor:Colors.mainBlue, flex:1}}>
        <StatusBar backgroundColor={Colors.mainBlue}/>
        <View style={{alignItems:"center"}}>
          <Image style={styles.image} source={logo}/>
        </View>

        <Carousel />

        <View style={{alignItems:"center", marginTop:40}}>
          <TouchableOpacity onPress={() => {
            navigation.navigate("Login")
          }} style={[styles.button, {backgroundColor:Colors.yellow}]}>
            <Text style={[styles.buttonText, {color:"black"}]}>Usar una cuenta existente</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            navigation.navigate("Singin")
          }} style={[styles.button, {backgroundColor:"black"}]}>
            <Text style={[styles.buttonText, {color:"white"}]}>Crear una cuenta nueva</Text>
          </TouchableOpacity>
        </View>
    </View>
  )
}

export default WelcomeScreen

const DynamicStyles = (Colors) => StyleSheet.create({
  text: {
      color:Colors.text,
      fontFamily:"Lato-Regular"
  },
  image:{
    width: 320,
    objectFit:"contain",
    height:220,
  },
  button: {
    width:313,
    height:56,
    borderRadius:30,
    marginBottom:15
  },
  buttonText: {
   fontSize:20,
   textAlign:"center",
   fontFamily:"Raleway-Bold",
   textAlignVertical:"center",
   height:"100%" 
  }

})