import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView, Dimensions, Alert } from 'react-native'
import React, { useState, useContext } from 'react'
import useColors from '../Utils/Colors'
import { useNavigation } from '@react-navigation/native'
import { Ionicons, Fontisto } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import { usePost } from '../Utils/usePost'
import noPerfil from '../assets/images/noPerfil.png'
import Toast from 'react-native-toast-message'
import { UserContext } from '../Navigation'

const {width} = Dimensions.get('window')

const UserProfile = ({route}) => {

  const { sendedRequests, notifications } = useContext(UserContext)
  const { user } = route.params

  const myFriend = user.friends.includes(useContext(UserContext).user?._id)

  const navigation = useNavigation()
  const Colors = useColors()
  const styles = DynamicStyles(Colors)

  const [request, setRequest] = useState(sendedRequests.filter(req => req.receiverId === user?._id)[0] || null)
  const [slide, setSlide] = useState(false)
  const [sended, setSended] = useState(sendedRequests.some(req => req.receiverId === user?._id) || notifications.some(not => not.data.autorId === user?._id));

  const [openingChat, setOpeningChat] = useState(false)

  const handleSendFriendRequest = async () => {
    const response = await usePost('/requests/send', {receiverId:user?._id})
    if (response.error) {
      Toast.show({
        type:"error",
        text1:response.error,
        visibilityTime: 2000, 
        autoHide: true,
      }); return }  

    Toast.show({
      text1:"Solicitud Enviada!!",
      visibilityTime: 2000, 
      autoHide: true,
    })
    setSended(true)
    setRequest(response.request)
  }

  const handleSendMessage = async () => {
    setOpeningChat(true)
    const response = await usePost('/chat/getChatByUser', {
      userId: user?._id
    })

    if (response.error) {
      Toast.show({
        type:"error",
        text1:response.error,
        visibilityTime: 2000, 
        autoHide: true,
    }); return }

    if (response.chat) {
      navigation.navigate('Chat', {chat: response.chat})
      return
    }

    const response2 = await usePost('/chat/createChat', {
      id: user?._id
    })

    if (response2.error) {
      Toast.show({
        type:"error",
        text1:response.error,
        visibilityTime: 2000, 
        autoHide: true,
    }); return }

    navigation.navigate('Chat', {chat: response2.chat})
  }

  const deleteRequest = () => {
    Alert.alert(
      "Eliminar solicitud",
      "¿Estás seguro de que quieres eliminar esta solicitud?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            const response = await usePost('/requests/delete', { requestId: request._id });
  
            if (response.error) {
              Toast.show({
                type: "error",
                text1: response.error,
                visibilityTime: 2000,
                autoHide: true,
              });
              return;
            }
  
            Toast.show({
              text1: "Solicitud eliminada!",
              visibilityTime: 2000,
              autoHide: true,
            });
  
            setSended(false);
            setRequest(null);
          },
          style: "destructive",
        }
      ]
    );
  };

  return (
    <View style={{backgroundColor:Colors.background, flex:1, padding:10, alignItems:"center"}}>

        <View style={{flexDirection:"row", justifyContent:"space-between", width:"100%", marginBottom:30, padding:10}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={28} color={Colors.text} />
          </TouchableOpacity>
          <View style={{flexDirection:"row", width:70, justifyContent:"space-between"}}>
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
        </View>

        <View style={{marginBottom:10}}>
            <TouchableOpacity onPress={() => pickImage([10,13])}>
                <Image style={styles.profileImage} source={user?.image ? {uri:user.image} : noPerfil}/>
            </TouchableOpacity>
        </View>

        <Text style={styles.tuPerfil}>{user?.name}</Text>

        <View>
            {myFriend ? (
              <TouchableOpacity disabled={openingChat} style={[styles.sendRequestButton, {backgroundColor:openingChat?"#b4b4b4":Colors.mainBlue}]} onPress={handleSendMessage}>
                <Text style={{fontFamily:"Nunito-Bold", color:"white"}}>Enviar Mensaje</Text>
              </TouchableOpacity>
            ):(
              <TouchableOpacity style={[styles.sendRequestButton, {backgroundColor:sended?"#b4b4b4":Colors.mainBlue}]} onPress={sended?deleteRequest:handleSendFriendRequest}>
                <Text style={{fontFamily:"Nunito-Bold", color:"white"}}>{sended?"Solicitud Enviada":"Enviar Solicitud de Amistad"}</Text>
              </TouchableOpacity>
            )}

        </View>

        <View style={{flexDirection:"row", justifyContent:"space-around", width:"100%", marginTop:40}}>
            <TouchableOpacity onPress={() => setSlide(false)} style={{borderBottomColor:Colors.placeholder, borderBottomWidth:slide?0:2, paddingBottom:7, width:140}}>
                <Text style={{textAlign:"center", fontFamily:"Nunito-Bold", fontSize:20}}>Sobre mi</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSlide(true)} style={{borderBottomColor:Colors.placeholder, borderBottomWidth:!slide?0:2, paddingBottom:7, width:140}}>
                <Text style={{textAlign:"center", fontFamily:"Nunito-Bold", fontSize:20}}>Amigos</Text>
            </TouchableOpacity>
        </View>

        {slide ? (
            <View>
                {user.friends.length > 0 ? (
                    <View>

                    </View>
                ):(
                    <View>
                        <Text style={{padding:10}}>No ha añadido ningun amigo todavia</Text>
                    </View>
                )}
            </View>
        ):(
            <ScrollView style={{width, padding:20}}>
                {user?.description ? (
                    <View style={{paddingHorizontal:10, paddingVertical:20}}>
                        <Text style={{fontFamily:"Nunito-Medium"}}>{user.description}</Text>
                    </View>
                ):(
                  <View style={{paddingHorizontal:10, paddingVertical:20}}>
                      <Text style={{fontFamily:"Nunito-Medium"}}>Sin descripción</Text>
                  </View>
                )}

                <View style={{width:"100%"}}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.categoryText}>Idiomas</Text>
                  </View>
                  
                  <View style={styles.elementContainer}>
                    {user?.languages.map((len, index) => (
                      <View key={index} style={[styles.element, { backgroundColor:  Colors.yellow }]} >
                        <Text>{len}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.categoryText}>Edades</Text>
                  </View>
                  
                  <View style={styles.elementContainer}>
                    {user?.ages.map((len, key) => (
                      <View key={key} style={[styles.element, { backgroundColor: Colors.yellow}]} >
                        <Text>{len}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.categoryText}>Temas</Text>
                  </View>
                  
                  <View style={styles.elementContainer}>
                    {user?.preferences.map((len, index) => (
                      <View key={index} style={[styles.element, { backgroundColor: Colors.yellow }]} >
                        <Text>{len}</Text>
                      </View>
                    ))}
                  </View>
                    
                </View>
                <View style={{height:30}}/>
            </ScrollView>
        )}
    </View>
  )
}

export default UserProfile

const DynamicStyles = (Colors) => StyleSheet.create({

  tuPerfil: {
    fontFamily:"Raleway-Bold",
    fontSize:30
  },
  editBall: {
    backgroundColor:Colors.antiText,
    borderRadius:100,
    width:30,
    height:30,
    justifyContent:"center",
    alignItems:"center",
    position:"absolute",
    right:0
  },
  profileImage: {
    width:100,
    height:100,
    borderRadius:100
  },
  categoryText: {
    fontFamily:"Raleway-Bold",
    fontSize:20,
    marginLeft:10
  },
  element: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical:5,
    marginHorizontal:3,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:10,
    elevation:5
  },
  buttonText: {
   fontSize:24,
   textAlign:"center",
   fontFamily:"Raleway-Bold",
   textAlignVertical:"center",
   height:"100%" 
  },
  elementContainer: {
    flexDirection:"row",
    flexWrap:"wrap",
    marginVertical:10
  },
  sendRequestButton: {
    borderRadius:15,
    paddingVertical:5,
    paddingHorizontal:10,
    marginTop:10
  },
  dot: {
    borderRadius:100,
    width:9,
    height:9,
    position:"absolute",
    backgroundColor:"#ff0000"
  }

})