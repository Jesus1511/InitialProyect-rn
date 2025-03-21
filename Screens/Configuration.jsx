import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import React, { useContext } from 'react'
import useColors from '../Utils/Colors'
import { useNavigation } from '@react-navigation/native'
import { AntDesign, FontAwesome, FontAwesome6, Ionicons, Entypo } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserContext } from '../Navigation'

const Configuration = () => {

  const { user, setUser } = useContext(UserContext)

  const navigation = useNavigation()
  const Colors = useColors()
  const styles = DynamicStyles(Colors)

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token')
    setUser(null)
    navigation.navigate('WelcomeScreen')

  }

  return (
    <View style={{backgroundColor:Colors.background, flex:1, padding:10, alignItems:"center"}}>
        <View style={{ marginBottom: 15, width:"100%", flexDirection:"row", alignItems:"center", padding:10}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={28} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.h1}>Configuración</Text>
        </View>

        <View>
            <TouchableOpacity style={styles.button}>
                <FontAwesome name="user" size={32} color={Colors.text} />
                <View style={{paddingHorizontal:20}}>
                  <Text style={styles.text1}>Cuenta</Text>
                  <Text style={styles.text2}>información de tu cuenta</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <FontAwesome6 name="location-dot" size={32} color={Colors.text} />
                <View style={{paddingHorizontal:20}}>
                  <Text style={styles.text1}>Ubicación</Text>
                  <Text style={styles.text2}>acceso de la app a tu ubicación</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <AntDesign name="questioncircle" size={32} color={Colors.text} />
                <View style={{paddingHorizontal:20}}>
                  <Text style={styles.text1}>Ayuda</Text>
                  <Text style={styles.text2}>Centro de ayuda y soporte</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Ionicons name="notifications-sharp" size={32} color={Colors.text} />
                <View style={{paddingHorizontal:20}}>
                  <Text style={styles.text1}>Notificaciones</Text>
                  <Text style={styles.text2}>Permitir notificaciones emergentes</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.button}>
                <Entypo name="log-out" size={32} color="red" />
                <View style={{paddingHorizontal:20}}>
                  <Text style={[styles.text1, {color:"red"}]}>Cerrar Sesion</Text>
                </View>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default Configuration

const DynamicStyles = (Colors) => StyleSheet.create({

  h1:  {
    color:Colors.text,
    fontFamily:"Raleway-Bold",
    fontSize:30,
    paddingHorizontal:20
  },
  text1: {
      color:Colors.text,
      fontFamily:"Raleway-Bold",
      fontSize:16,
  },
  button: {
    width:320,
    borderBottomColor:Colors.text,
    borderBottomWidth:1,
    flexDirection:"row",
    paddingVertical:20
  }

})