import { StyleSheet, View, TouchableOpacity, Text, TextInput, StatusBar } from 'react-native'
import { useState, useContext } from 'react'
import { UserContext } from '../Navigation'
import useColors from '../Utils/Colors'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import Toast from 'react-native-toast-message';
import { usePost } from '../Utils/usePost'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login = () => {

    const {setUser} = useContext(UserContext)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loging, setLoging] = useState(false)

    const navigation = useNavigation()
    const Colors = useColors()
    const styles = DynamicStyles(Colors)
  
    async function handleLogin () {
      try {
        setLoging(true)

        if (email == "" || password == "") {
            Toast.show({
              type: 'error',
              text1: 'Rellene todos los campos',
              visibilityTime: 2000, 
              autoHide: true,
            });
            return
          }

        const response = await usePost("/auth/login", {
          email,
          password
        })
        if (response.error) {
          Toast.show({
            type: 'error',
            text1: response.error,
            visibilityTime: 2000, 
            autoHide: true,
          });
        }
        
        await AsyncStorage.setItem('token', response.token)
        const user = response.user
        setUser(user)
        navigation.navigate("HomeScreen")
        
      } finally {
        setLoging(false)
      }
    
    }
    
    async function handleForgivenPassword(params) {
        
    }

  return (
    <View style={{backgroundColor:Colors.background, flex:1, padding:10, alignItems:"center"}}>
        <StatusBar backgroundColor={Colors.background}/>
        <View style={{ marginBottom: 15, width:"100%" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={28} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.h1}>Iniciar Sesión</Text>

        <TextInput 
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder='Email'
          placeholderTextColor={Colors.placeholder}
          />
        <TextInput 
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          placeholder='Contraseña'
          placeholderTextColor={Colors.placeholder}
          />

        <TouchableOpacity style={{marginBottom:200}} onPress={handleForgivenPassword}>
            <Text style={styles.forgetText}>Haz olvidado tu contraseña</Text>
        </TouchableOpacity>

        <View style={{alignItems:"center"}}>
            <TouchableOpacity style={[styles.button, {backgroundColor:loging?"#b4b4b4":Colors.yellow}]} onPress={handleLogin}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default Login

const DynamicStyles = (Colors) => StyleSheet.create({

  h1: {
    textAlign:"center",
    fontFamily:"Raleway-ExtraBold",
    fontSize:44,
    marginTop:40,
    marginBottom:80,
    color:Colors.text
  },
  button: {
    width:313,
    height:56,
    borderRadius:30,
    marginBottom:30
  },
  buttonText: {
   fontSize:24,
   textAlign:"center",
   fontFamily:"Raleway-Bold",
   textAlignVertical:"center",
   height:"100%" 
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
  forgetText: {
    color:Colors.placeholder,
    fontSize:20,
    fontFamily:"Relaway-SemiBold",
    textAlign:"center"
  }

})