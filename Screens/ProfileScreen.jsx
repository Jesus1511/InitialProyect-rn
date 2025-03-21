import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView, TextInput, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import useColors from '../Utils/Colors'
import { useNavigation } from '@react-navigation/native'
import { Ionicons, Fontisto, Entypo } from '@expo/vector-icons'
import { UserContext } from '../Navigation'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system'
import { usePost } from '../Utils/usePost'

import noPerfil from '../assets/images/noPerfil.png'
import Toast from 'react-native-toast-message'

const {width} = Dimensions.get('window')

const ProfileScreen = () => {

  const { user, setUser, notifications } = useContext(UserContext)

  const navigation = useNavigation()
  const Colors = useColors()
  const styles = DynamicStyles(Colors)

  const [adding, setAdding] = useState(false)
  const [description, setDescription] = useState("")
  const [friendsData, setFriendsData] = useState(null)

  const [slide, setSlide] = useState(false)

  const uploadImage = async (imageUri) => {
    try {
      const resizedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }], // Ajusta el ancho según tus necesidades
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Ajusta la compresión
      );
  
      // Convertir la imagen redimensionada a base64
      let base64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      base64 =  `data:image/jpeg;base64,${base64}`
     
      const imageResponse = await usePost('/auth/uploadImage', { base64 });
  
      if (imageResponse.error) {
        Toast.show({
          type:"error",
          text1:imageResponse.error,
          visibilityTime: 2000,
          autoHide: true
        })
        return
      }

      const userResponse = await usePost('/auth/updateUser', {updatedData:{image: imageResponse.image}})

      if (userResponse.error) {
        Toast.show({
          type:"error",
          text1:res.error,
          visibilityTime: 2000,
          autoHide: true
        })
        return
      }
      setUser(userResponse.user)
      
  
    } catch (error) {
      console.error('Error en la subida:', error);
    }
  };

  const pickImage = async (aspect) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Se necesitan permisos para acceder a la galería.');
      return;
    }

    // Abre la galería
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: aspect,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri; // Obtiene la URI de la imagen
      await uploadImage(uri);
    }
  };

  const handleSaveDescription = async () => {
    const response = await usePost('/auth/updateUser', {updatedData: {description}})
    setAdding(false)

    if (response.error) {
      Toast.show({
        type:"error",
        text1:res.error,
        visibilityTime: 2000,
        autoHide: true
      });return
    }

    console.log(response.user)
    setUser(response.user)
  }

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friends = await Promise.all(
          user.friends.map(async (id) => {
            const response = await usePost('/auth/getUser', { id });
            if (response.error) {
              console.error(response);
              return null;
            }
            return response.user;
          })
        );
  
        setFriendsData(friends.filter(user => user !== null));
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
  
    fetchFriends();
  }, []);
  

  useEffect(() => {
    setAdding(false)
  },[slide])

  return (
    <View style={{backgroundColor:Colors.background, flex:1, padding:10, alignItems:"center"}}>

        <View style={{flexDirection:"row", justifyContent:"space-between", width:"100%", marginBottom:30, padding:10}}>
          <Text style={styles.tuPerfil}>Tu Perfil</Text>
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
                <View style={styles.editBall}>
                    <Entypo name="edit" size={24} color={Colors.text} />
                </View>
            </TouchableOpacity>
        </View>

        <Text style={styles.tuPerfil}>{user?.name}</Text>

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
                    <>
                      {friendsData?.map((friend) => (
                        <TouchableOpacity onPress={() => {
                          navigation.navigate('UserProfile', {user:friend})
                        }} style={{flexDirection:"row", width, paddingVertical:10, paddingHorizontal:26, borderBottomColor:"black", borderBottomWidth:.5}}>
                          <Image style={{width:50, height:50, borderRadius:30}} source={friend.image? {uri:friend.image}: noPerfil} />
                          <Text style={{fontSize:20, paddingLeft:20, fontFamily:"Nunito-Bold"}}>{friend.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </>
                ):(
                    <View>
                        <Text style={{padding:10}}>No haz añadido ningun amigo todavia</Text>
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
                    <>
                    {adding ? (
                        <View style={{marginBottom:30}}>
                            <TextInput
                              multiline
                              value={description}
                              style={styles.textInput}
                              onChangeText={(text) => setDescription(text)}
                              placeholder='Añade una descripción'
                            />
                            <TouchableOpacity style={{backgroundColor:Colors.mainBlue, padding:5, width:100, borderRadius:10}} onPress={handleSaveDescription}>
                                <Text style={{color:Colors.antiText, textAlign:"center"}}>Guardar</Text>
                            </TouchableOpacity>
                        </View>

                    ):(
                        <TouchableOpacity onPress={() => setAdding(true)} style={{paddingVertical:20, margin:10, paddingHorizontal:50, borderWidth:.5, borderColor:"black"}}>
                            <Text style={{textAlign:"center"}}>Añadir Descripción +</Text>
                        </TouchableOpacity>
                    )}
                    </>

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

export default ProfileScreen

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
  dot: {
    borderRadius:100,
    width:9,
    height:9,
    position:"absolute",
    backgroundColor:"#ff0000"
  }

})