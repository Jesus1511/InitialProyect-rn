import { StyleSheet, View, TouchableOpacity, ScrollView, TextInput, Text, Image } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import useColors from '../Utils/Colors'
import { useNavigation } from '@react-navigation/native'
import { usePost } from '../Utils/usePost'
import LoadingBox from '../Utils/LoadingBox'
import { Ionicons, Fontisto } from '@expo/vector-icons';
import { UserContext } from '../Navigation'

import noPerfil from '../assets/images/noPerfil.png';

const ChatsScreen = () => {
  
  const {user, chats, notifications, loadData} = useContext(UserContext)

  const navigation = useNavigation()
  const Colors = useColors()
  const styles = DynamicStyles(Colors)

  const [search, setSearch] = useState("")
  const [usersData, setUsersData] = useState({})

  // Obtener datos de los usuarios en una sola función
  const obtenerDatosDeUsuarios = async () => {
    const usersData = {};

    for (const chat of chats) {
      const otherUser = chat.users.filter((userr) => userr._id !== user?._id)[0];
      const response = await usePost('/auth/getUserData', { userId: otherUser._id });
      if (response) {
        usersData[otherUser._id] = response.user; // Almacenar los datos del usuario
      }
    }

    setUsersData(usersData);
  };

  useEffect(() => {
    loadData()
  },[])

  useEffect(() => {
    obtenerDatosDeUsuarios()
  }, [chats])

  useEffect(() => {
    
  }, [search])
  

  return (
    <ScrollView style={{backgroundColor:Colors.background, flex:1, paddingVertical:20,}}>
      <View style={{alignItems:"center"}}>

        <View style={{flexDirection:"row", justifyContent:"space-evenly", width:"100%"}}>
          <TextInput
            value={search}
            onChangeText={(text) => setSearch(text)}
            style={styles.SearchBar}
            placeholder='Buscar por Nombre'
          />
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications" size={28} color={Colors.text} />
            {notifications.length > 0 && (
              <View style={styles.dot}/>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Configuration')}>
            <Fontisto name="player-settings" size={28} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.mensajes}>Mensajes</Text>

        {chats ? (
          <>
          {chats.length > 0 ? (
            <>
            {chats.map((chat, index) => {
              const otherUser = chat.users.filter((userr) => userr._id !== user?._id)[0];
              const otherUserData = usersData[otherUser._id]; 
              const notReadedMessages = chat.notReadedMessages.filter((message) => message.user._id !== user?._id)
              console.log(notReadedMessages)
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigation.navigate('Chat', { chat })}
                  style={{ flexDirection: "row", alignItems: "center", justifyContent:"space-between", width: "100%", padding: 15, borderBottomWidth: 0.5, borderColor: "#00000020" }}
                >
                  <View style={{flexDirection:"row"}}>
                    <Image
                      source={otherUserData?.image ? { uri: otherUserData.image } : noPerfil}
                      style={{ width: 50, height: 50, borderRadius: 100, marginRight: 15 }}
                    />
                    <Text style={{ fontFamily: "Lato-SemiBold", fontSize: 17 }}>
                      {otherUserData?.name || "Cargando..."}
                    </Text>
                  </View>

                </TouchableOpacity>
              );
            })}
            </>
          ):(
            <Text>No hay ningun chat todavia</Text>
          )}
          </>  
        ):(

          <View style={{ width: "100%" }}>
            {[...Array(4)].map((_, index) => (
              <View key={index} style={{ flexDirection: "row", alignItems: "center", width: "100%", padding: 15, borderBottomWidth: 0.5, borderColor: "#00000020" }}>
                <LoadingBox width={50} height={50} radius={100} />
                <View style={{ width: 15 }} />
                <LoadingBox width={250} height={40} radius={100} />
              </View>
            ))}
          </View>   
        )}

      </View>
    </ScrollView>
  )
}

export default ChatsScreen

const DynamicStyles = (Colors) => StyleSheet.create({

  SearchBar: {
    width:275,
    height:45,
    backgroundColor:"#385DAE13",
    borderRadius:16,
    paddingHorizontal:20,
    fontFamily:"Nunito-Medium",
    marginBottom:15,
    fontSize:20,
    color:Colors.text
  },

  mensajes: {
    width:"100%",
    paddingHorizontal:20,
    fontSize:24,
    fontFamily:"Raleway-Bold",
    marginBottom:15
  },
  dot: {
    borderRadius:100,
    width:9,
    height:9,
    position:"absolute",
    backgroundColor:"#ff0000"
  }

})