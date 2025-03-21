import { StyleSheet, View, TouchableOpacity, TextInput, StatusBar, ScrollView, Text, Image } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import useColors from '../Utils/Colors'
import { useNavigation } from '@react-navigation/native'
import { Ionicons, Fontisto } from '@expo/vector-icons';
import { usePost } from '../Utils/usePost'
import { UserContext } from '../Navigation'
import LoadingBox from '../Utils/LoadingBox';
import { LinearGradient } from 'expo-linear-gradient'
import { Entypo } from '@expo/vector-icons';

import noPerfilBigger from '../assets/images/noPerfilBigger.png'
import { edades, preferencias, lenguajes } from '../Utils/Consts';
import Toast from 'react-native-toast-message';

const HomeScreen = () => {

  const {user, users, events, loadData, setUsers, notifications} = useContext(UserContext)

  const navigation = useNavigation()
  const Colors = useColors()
  const styles = DynamicStyles(Colors)

  const [search, setSearch] = useState("")
  const [activeFilters, setActiveFilters] = useState([])
  const [level, setLevel] = useState("state")

  useEffect(() => { 
    loadData(level)
  }, [])


  const handleRegret = (user) => {
    setUsers(users.filter((userr) => userr._id !== user._id));
  };
  
  
  const handleCreateChat = async (user) => {
    console.log(user._id)
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

    navigation.navigate('Chat', {chat: response.chat})
  }

  return (
    <ScrollView style={{backgroundColor:Colors.background, paddingVertical:20}}>
      <View style={{alignItems:"center"}}>
        <StatusBar backgroundColor={"white"}/>
        <View style={{flexDirection:"row", justifyContent:"space-evenly", width:"100%"}}>
          <TextInput
            value={search}
            onChangeText={(text) => setSearch(text)}
            style={styles.SearchBar}
            placeholder='Buscar Filtro'
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

        <ScrollView horizontal style={{height:30}}>
          {activeFilters.map((filter) => (
            <View>
              <Text>{filter}</Text>
            </View>
          ))}
        </ScrollView>

        {users && events ? (
          <View style={{flexDirection:"row", flexWrap:"wrap", justifyContent:"space-evenly"}}>
            {users.length > 0 ? (
              <>
                {users.map((user, index) => {
                  return (
                    <View key={index}>
                      <View style={styles.userCard}>
                        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', {user})} style={{ position:"absolute", width:"100%", height:"100%"}}>
                          <Image source={user.image?{uri:user.image}:noPerfilBigger} style={styles.userImage}/>
                          <LinearGradient 
                            colors={['rgba(0,0,0,0.6)','rgba(0,0,0,0)','rgba(0,0,0,0)' ]} 
                            style={styles.innerShadow} 
                          />
                        </TouchableOpacity>

                        <View style={{zIndex:3, paddingVertical:5, paddingHorizontal:10}}>
                          <Text numberOfLines={1} style={{color:"white", fontFamily:"Raleway-SemiBold", fontSize:18}}>{user.name}</Text>
                          <Text numberOfLines={1} style={{color:"white", fontFamily:"Raleway-SemiBold", fontSize:15}}>{user.ubication[level]}</Text>
                        </View>
                      </View>
                      <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:10}}>
                        <TouchableOpacity onPress={() => handleRegret(user)} style={[styles.userButton, {backgroundColor:"red"}]}>
                          <Entypo name="cross" size={30} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCreateChat(user)} style={[styles.userButton, {backgroundColor:Colors.mainBlue}]}>
                          <Entypo name="message" size={30} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', {user})} style={[styles.userButton, {backgroundColor:"#3fdd33"}]}>
                          <Entypo name="plus" size={30} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                  )
                })}
                <View style={{width:154}}/>
              </>
            ):(
              <View>
                <Text>No se encontraron personas en tu zona</Text>
              </View>
            )}
            {events.length > 0 && (
              <View style={{marginBottom:20}}>
                {events.map((event, index) => {

                  return (
                    <TouchableOpacity onPress={() => navigation.navigate('Event', {event, level})} key={index} style={styles.event}>
                      <Image source={{uri:event?.image}} style={styles.eventImage}/>
                      <View style={{padding:10}}>
                        <Text numberOfLines={1} style={{fontFamily:"Raleway-Bold", fontSize:20, marginBottom:5}}>{event.name}</Text>
                        <Text style={{fontFamily:"Raleway-SemiBold", fontSize:12, marginBottom:10}}>{event.description}</Text>
                        <View style={{flexDirection:"row"}}>
                          <View style={styles.eventBlueContainer}>
                            <Text numberOfLines={1} style={styles.blueContainerText}>{event.date}</Text>
                          </View>
                          <View style={styles.eventBlueContainer}>
                            <Text numberOfLines={1} style={styles.blueContainerText}>{event.time}</Text>
                          </View>
                        </View>
                      </View>

                    </TouchableOpacity>
                  )
                })}
              </View>
            )}

            <View style={{width:"100%", alignItems:"center", marginTop:20}}>
              <Text style={{textAlign:"center", color:Colors.text, fontFamily:"Raleway-SemiBold", fontSize:18}}>¿Tienes un gran evento en mente?</Text>
              <Text style={{textAlign:"center", color:Colors.text, fontFamily:"Raleway-Bold", fontSize:25}}>Hazlo Publico!!</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CreateEvent')} style={styles.buttonEvent}>
                <Text style={styles.buttonEventText}>Crear Evento</Text>
              </TouchableOpacity>
            </View>

          </View>
        ):(
          <View>
            <LoadingBox />
          </View>
        )}
      </View>
      <View style={{height:50}}/>

    </ScrollView>
  )
}

export default HomeScreen

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
  userCard: {
    width:162,
    height:240,
    backgroundColor:"gray",
    margin:5
  },
  buttonEventText: {
    color:Colors.text,
    textAlign:"center",
    fontFamily:"Raleway-Bold",
    fontSize:20
  },
  buttonEvent: {
    backgroundColor:Colors.yellow,
    paddingHorizontal:30,
    paddingVertical:10,
    borderRadius:15,
    marginTop:15
  },
  eventImage: {
    width:340,
    height:200,
    backgroundColor:"#b4b4b4",
    borderRadius:15
  },
  blueContainerText: {
    maxWidth:135,
    color:"white",
    fontFamily:"Nunito-Bold"
  },
  eventBlueContainer: {
    backgroundColor:Colors.mainBlue,
    borderRadius:10,
    paddingVertical:5,
    marginRight:10,
    paddingHorizontal:10
  },
  event: {
    marginVertical:25,
    alignItems:"center"
  },
  userImage: {
    width:"100%",
    height:"100%",
    position:"absolute",
    zIndex:1,
  },
  innerShadow: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 2,
  },
  userButton: {
    padding:5,
    borderRadius:100
  },
  dot: {
    borderRadius:100,
    width:9,
    height:9,
    position:"absolute",
    backgroundColor:"#ff0000"
  }


})