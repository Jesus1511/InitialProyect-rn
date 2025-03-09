import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native'
import React, { useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'

import glogo from '../assets/images/glogo.webp'
const ANDROID_GOOGLE_OAUTH_ID = "378995723158-pb3d7so1lbt392ctli0gs5eu5l9oc0en.apps.googleusercontent.com" 
const WEB_GOOGLE_OAUTH_ID = "378995723158-l0855lvj5uncvjqsre4gj8c0of0b1m6h.apps.googleusercontent.com" 

WebBrowser.maybeCompleteAuthSession()

const GoogleAuth = ({handleGoogleSignIn}) => {

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: WEB_GOOGLE_OAUTH_ID,
    androidClientId: ANDROID_GOOGLE_OAUTH_ID,
  })

  useEffect(() => {
    handleGoogleSignIn()
  }, [response])

  return (
    <View style={{alignItems: 'center',}}>
      <TouchableOpacity style={styles.mainButton} onPress={() => promptAsync()}>
        <Image source={glogo} style={{ width: 30, height: 30, marginRight:15 }} />
        <Text style={{fontFamily:"Lato-Bold", fontSize:18}}>Iniciar Sesión con Google</Text>
      </TouchableOpacity>
    </View>

  )
}

export default GoogleAuth

const styles = StyleSheet.create({
  mainButton: {
    backgroundColor:"white",
    width:"85%",
    borderRadius:20,
    flexDirection:"row",
    paddingHorizontal:20,
    paddingVertical:15,
    alignItems:"center",
    justifyContent:"center"
  }
})
