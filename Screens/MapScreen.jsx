import { StyleSheet, View, TouchableOpacity, TextInput, Text, Dimensions, Animated, Image, ScrollView } from 'react-native'
import { useState, useContext, useRef } from 'react'
import useColors from '../Utils/Colors'
import { useNavigation } from '@react-navigation/native'
import { Ionicons, Fontisto, Entypo, AntDesign } from '@expo/vector-icons'
import Map from '../components/MapScreen/Map'
import { UserContext } from '../Navigation'
import { LinearGradient } from 'expo-linear-gradient'
import Toast from 'react-native-toast-message'

import UserCustomMarker from '../components/MapScreen/UserCustomMarker'
import EventCustomMarker from '../components/MapScreen/EventCustomMarker'

const {width, height} = Dimensions.get('window')

const MapScreen = () => {

  const {users, events, setUsers, notifications} = useContext(UserContext)

  const navigation = useNavigation()
  const Colors = useColors()
  const styles = DynamicStyles(Colors)

  const [search, setSearch] = useState()
  const [userOpen, setUserOpen] = useState()
  const [eventsOpen, setEventsOpen] = useState(false)

  const handleRegret = (user) => {
    setUsers(users.filter((userr) => userr._id !== user._id))
  }
  
  const handleCreateChat = async (user) => {
    const response = await usePost('/chat/createChat',
      {id:user._id}
    )

    if (response.error) {
      Toast.show({
        type:"error",
        text1:response.error,
        visibilityTime: 2000, 
        autoHide: true,
      })
      return
    }

    navigation.navigate('chat', {chat: response.chat})
  }
  
  const handleSendFriendRequest = async (user) => {
    const response = await usePost('/auth/sendFriendRequest',
      {id:user._id}
    )

    if (response.error) {
      Toast.show({
        type:"error",
        text1:response.error,
        visibilityTime: 2000, 
        autoHide: true,
      })
      return
    }
  
      Toast.show({
        text1:"Solicitud Enviada!!",
        visibilityTime: 2000, 
        autoHide: true,
      })
  }

  return (
    <View style={{backgroundColor:Colors.background, flex:1}}>

        <View style={{flexDirection:"row", justifyContent:"space-evenly", width:"100%", paddingVertical:15}}>
          <TextInput
            value={search}
            onChangeText={(text) => setSearch(text)}
            style={styles.SearchBar}
            placeholder='Buscar Locación'
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

        <Map width={width} height={height}>
            
            {eventsOpen ? (
              <>
              {events.map((event) => {
                const coordinate = {longitude: event.location.longitude, latitude: event.location.latitude}

                const showDetails = () => {
                  navigation.navigate('Event', {event})
                }

                return (
                  <EventCustomMarker showDetails={showDetails} coordinate={coordinate} text={event.name} image={event.image}/>
                )
              })}
              </>
            ):(
              <>
              {users.map((user) => {
                const coordinate = {longitude: user.ubication.longitude, latitude: user.ubication.latitude}

                const showDetails = () => {
                  setEventsOpen(false)
                  setUserOpen(user)
                }

                return (
                  <UserCustomMarker showDetails={showDetails} coordinate={coordinate} text={user.name} image={user.image}/>
                )
              })}
              </>
            )}
            
        </Map>

        {userOpen ? (
          <View style={{alignItems:"center", paddingBottom:10}}>
            <Animated.View style={styles.userOpenContainer}>
              <View style={{flexDirection:"row", justifyContent:"space-between", width:220}}>
                <View style={{flexDirection:"row", justifyContent:"space-between", width:115, marginBottom:15}}>
                  <Image style={styles.userOpenImage} source={{uri:userOpen.image}} />
                  <Text style={{fontFamily:"Raleway-Bold", fontSize:19, maxHeight:45, marginLeft:5}}>{userOpen.name}</Text>
                </View>

                <TouchableOpacity onPress={() => setUserOpen(null)}>
                  <Entypo name="cross" size={15} color={Colors.text} />
                </TouchableOpacity>
              </View>

              <View style={{flexDirection:"row", justifyContent:"space-between", width:220}}>
                <TouchableOpacity onPress={() => handleRegret(userOpen)} style={[styles.userButton, {backgroundColor:"red"}]}>
                  <Entypo name="cross" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreateChat} style={[styles.userButton, {backgroundColor:Colors.mainBlue}]}>
                  <Entypo name="message" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSendFriendRequest} style={[styles.userButton, {backgroundColor:"#3fdd33"}]}>
                  <Entypo name="plus" size={30} color="white" />
                </TouchableOpacity>
              </View>

            </Animated.View>
            <LinearGradient 
              colors={['rgba(0,0,0,0)','rgba(0,0,0,0)','rgba(0,0,0,0)','rgba(0,0,0,0.5)']} 
              style={styles.innerShadow} 
            />
          </View>
        ):(
          <View style={{flexDirection:"row", paddingBottom:15, width, alignItems:"flex-end",}}>

            <View style={{paddingHorizontal:20, zIndex:2}}>
              <TouchableOpacity style={{ backgroundColor:"white", width:75, alignItems:"center", paddingVertical:4, borderRadius:10}} onPress={() => {
                if (events.length > 0) {
                  setEventsOpen(!eventsOpen)
                } else {
                  Toast.show({
                    type:"error",
                    text1:"No hay eventos para mostrar",
                    visibilityTime:2000,
                    autoHide:true,
                  })
                }}}>
                <AntDesign name={eventsOpen?"down":"up"} size={28} color="black" />
                <Text style={{fontFamily:"Nunito-Bold", fontSize:16}}>Eventos</Text>
              </TouchableOpacity>
            </View>

            {eventsOpen && (
              <>
                <View style={{width:300, height:200, zIndex:2}}>
                  <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                    {events.map((event, key) => (
                      <TouchableOpacity key={key} onPress={() => navigation.navigate('Event', {event, level:"city"})}
                        style={{marginHorizontal:5, justifyContent:"flex-end", width:130, height:200, borderRadius:10, overflow:"hidden"}}>
                        <Image source={{uri:event.image}} style={{width:"100%", height:"100%", zIndex:0, backgroundColor:"#b4b4b4", position:"absolute"}} />
                        <LinearGradient 
                          colors={['rgba(0,0,0,0)','rgba(0,0,0,0)','rgba(0,0,0,0.5)']} 
                          style={styles.innerShadow} 
                        />
                        <View style={{padding:5}}>
                          <Text numberOfLines={3} style={styles.eventName}>{event.name}</Text>
                          <View style={{backgroundColor:Colors.mainBlue, borderRadius:10, padding:5, marginTop:5}}>
                            <Text style={{color:"white", fontSize:13}}>{event.date}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                    <View style={{width:70}}></View>
                  </ScrollView>
                </View>

                <LinearGradient 
                  colors={['rgba(0,0,0,0)','rgba(0,0,0,0)','rgba(0,0,0,0.5)']} 
                  style={styles.innerShadow} 
                />
              </>
            )}

        </View>
        )}
        
    </View>
  )
}

export default MapScreen

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
  userOpenContainer: {
    paddingHorizontal:30,
    paddingVertical:20,
    borderRadius:15,
    backgroundColor:Colors.background,
    zIndex:2
  },
  userOpenImage: {
    width:45,
    height:45,
    borderRadius:50,
    backgroundColor:"#b4b4b4"
  },
  userButton: {
    padding:5,
    borderRadius:100
  },
  innerShadow: {
    width,
    height:height/3.8,
    position: "absolute",
    bottom:0,
    zIndex: 0,
  },
  eventName: {
    color:"white",
    fontFamily: "Nunito-Bold",
    fontSize:15,
    maxWidth:120
  },
  dot: {
    borderRadius:100,
    width:9,
    height:9,
    position:"absolute",
    backgroundColor:"#ff0000"
  }


})