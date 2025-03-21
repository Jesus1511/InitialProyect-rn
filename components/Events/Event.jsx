import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView, Alert } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import useColors from '../../Utils/Colors'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import { usePost } from '../../Utils/usePost'
import Toast from 'react-native-toast-message'
import { UserContext } from '../../Navigation'
import { Entypo } from '@expo/vector-icons'

const HomeScreen = ({route}) => {

  const { user, loadData } = useContext(UserContext)
  let { event, level } = route.params

  const navigation = useNavigation()
  const Colors = useColors()
  const styles = DynamicStyles(Colors)

  const [asistence, setAsistence] = useState(null)
  const [saving, setSaving] = useState(false)
  const [eventData, setEventData] = useState(event);

  useEffect(() => {
    setAsistence(eventData.assists.includes(user._id));
  }, [eventData]);   
  

  const handleAssist = async () => {
    try {
      setSaving(true);
      const response = await usePost('/events/assist', { eventId: eventData._id });
  
      if (response.error) {
        Toast.show({ type: 'error', text1: response.error, visibilityTime: 2000, autoHide: true });
        return;
      }

      setEventData(prev => ({
        ...prev,
        assists: [...prev.assists, user._id]
      }));
  
      setAsistence(true);
  
      Toast.show({ text1: "Asistencia Programada!!", visibilityTime: 2000, autoHide: true });
    } finally {
      setSaving(false);
    }
  };
  
  const handleUnassist = async () => {
    try {
      setSaving(true);
      const response = await usePost('/events/unassist', { eventId: eventData._id });
  
      if (response.error) {
        Toast.show({ type: 'error', text1: response.error, visibilityTime: 2000, autoHide: true });
        return;
      }

      setEventData(prev => ({
        ...prev,
        assists: prev.assists.filter(id => id.toString() !== user._id.toString())
      }));
  
      setAsistence(false);
  
      Toast.show({ text1: "Asistencia Declinada", visibilityTime: 2000, autoHide: true });
    } finally {
      setSaving(false);
    }
  };
  

  const handleDelete = async () => {
    Alert.alert(
        "Eliminar Evento",
        "¿Estás seguro de querer eliminar este evento? Se notificará a todos los usuarios de su eliminación.",
        [
            { text: "Cancelar", style: "cancel", onPress: () => {} },
            { 
                text: "Eliminar", 
                style: "destructive",
                onPress: async () => {
                    const response = await usePost('/events/delete', {
                        eventId: event._id
                    });

                    if (response.error) {
                        Toast.show({
                            type: 'error',
                            text1: response.error,
                            visibilityTime: 2000, 
                            autoHide: true,
                        });
                        return;   
                    }
                    navigation.navigate("HomeScreen");
                }
            }
        ]
    );
};


  return (
    <ScrollView style={{backgroundColor:Colors.background, flex:1}}>
      <View style={{alignItems:"center"}}>

        <View style={{ marginBottom: 15, width:"100%", padding:10, flexDirection:"row", justifyContent:"space-between"}}>
          <TouchableOpacity onPress={() => { navigation.goBack(); loadData(level)}}>
            <AntDesign name="arrowleft" size={28} color={Colors.text} />
          </TouchableOpacity>

          {eventData.autorId == user._id && (
            <TouchableOpacity onPress={handleDelete}>
                <Entypo name="trash" size={26} color="red" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.pressableImage}>
          <Image source={{ uri: eventData.image }} style={{ width: "100%", height: "100%" }} />
        </View>

        <View style={{width:"100%", padding:25}}>
          <Text style={styles.h1}>{eventData.name}</Text>
          <Text style={styles.desc}>{eventData.description}</Text>

          <View>
            <Text style={{fontFamily:"Nunito-Bold", fontSize:20}}>Asistencias: <Text style={{color:Colors.mainBlue}}>{eventData.assists.length}</Text></Text>
          </View>

          <View style={{flexDirection:"row", flexWrap:"wrap"}}>
            <View style={styles.eventBlueContainer}>
              <Text numberOfLines={1} style={styles.blueContainerText}>{eventData.date}</Text>
            </View>
            <View style={styles.eventBlueContainer}>
              <Text numberOfLines={1} style={styles.blueContainerText}>{eventData.time}</Text>
            </View>
          </View>
        </View>
        


        <TouchableOpacity onPress={asistence? handleUnassist : handleAssist} style={[styles.publishButton, {backgroundColor:saving ? "#b4b4b4":Colors.yellow}]}>
            <Text style={styles.publishButtonText}>{!asistence?"Asistir al Evento":"declinar asistencia"}</Text>
        </TouchableOpacity>

        <View style={{height:40}}/>
      </View>
    </ScrollView>
  )
}

export default HomeScreen

const DynamicStyles = (Colors) => StyleSheet.create({

  pressableImage: {
    width:"100%",
    backgroundColor:"gray",
    height:220,
    marginBottom:20
  },
  publishButton: {
    backgroundColor:Colors.yellow,
    width:310,
    borderRadius:20,
    paddingVertical:15,
    marginTop:40
  },
  publishButtonText: {
    fontSize:20,
    textAlign:"center",
    fontFamily:"Raleway-Bold"
  },
  h1: {
    fontFamily:"Raleway-Bold",
    fontSize:25,
    marginBottom:5
  },
  desc: {
    fontFamily:"Raleway-SemiBold",
    fontSize:14,
    marginVertical:15
  },
  blueContainerText: {
    color:"white",
    fontFamily:"Nunito-Bold",
    fontSize:16
  },
  eventBlueContainer: {
    backgroundColor:Colors.mainBlue,
    borderRadius:12,
    maxWidth:190,
    paddingVertical:10,
    marginRight:10,
    paddingHorizontal:15,
    marginVertical:5
  },
  


})