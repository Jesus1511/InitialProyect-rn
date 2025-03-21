import { StyleSheet, View, TouchableOpacity, Text, FlatList, Dimensions, Image } from 'react-native';
import { useContext } from 'react';
import useColors from '../Utils/Colors';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { UserContext } from '../Navigation';
import Toast from 'react-native-toast-message';

import noPerfil from '../assets/images/noPerfil.png'
import { usePost } from '../Utils/usePost';

const {width} = Dimensions.get('window')

const Notifications = () => {
  const { notifications, setNotifications } = useContext(UserContext);
  const navigation = useNavigation();
  const Colors = useColors();
  const styles = DynamicStyles(Colors);

  const handleAcceptRequest = async (request) => {
    const response1 = await usePost('/requests/accept', {
      requestId:request._id
    })
    const response2 = await usePost('/auth/getUser', {
      id:request.autorId
    })
    if (response1.error || response2.error) {
      Toast.show({
        type:"error",
        text1:response1.error || response2.error,
        visibilityTime:2000,
        autoHide:true
      }); return
    }
    console.log("every")
    console.log(notifications)
    setNotifications((prev) => prev.filter((noti) => noti.data._id !== request._id));
    console.log("s")
    Toast.show({
      text1:"Solicitud aceptada, toca para usuario",
      onPress:() => {navigation.navigate('UserProfile', {user: response2.user});},
      visibilityTime:4000,
      autoHide:true
    });
  };

  const handleRejectRequest = async (request) => {
    const response = await usePost('/requests/delete', {
      requestId:request._id
    })
    if (response.error) {
      Toast.show({
        type:"error",
        text1:response.error,
        visibilityTime:2000,
        autoHide:true
      }); return
    }

    setNotifications((prev) => prev.filter((noti) => noti.data._id !== request._id));
  };

  return (
    <View style={{ backgroundColor: Colors.background, flex: 1, alignItems: "center" }}>
      <View style={{ marginBottom: 15, width: "100%", flexDirection: "row", alignItems: "center", padding: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.h1}>Notificaciones</Text>
      </View>

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.notificationContainer}>
              <TouchableOpacity style={{flexDirection:"row", justifyContent:"space-between", width:300}}>
                <Image style={{width:40, height:40, borderRadius:100}} source={item.data.user.image?{uri:item.data.user.image}:noPerfil}/>
                <Text numberOfLines={2} style={styles.notificationText}>{item.description}</Text>
              </TouchableOpacity>

              {item.type === 'chat_message' ? (
                <TouchableOpacity 
                  style={styles.chatButton}
                  onPress={() => navigation.navigate("Chat", { chat: item.data })}
                >
                  <Text style={styles.buttonText}>Ir al chat</Text>
                </TouchableOpacity>
              ) : item.type === 'friend_request' ? (
                <View style={styles.requestButtons}>
                  <TouchableOpacity 
                    style={[styles.requestButton, { backgroundColor: "#b4b4b4" }]} 
                    onPress={() => handleRejectRequest(item.data)}
                  >
                    <Text style={styles.buttonText}>Rechazar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.requestButton, { backgroundColor: Colors.mainBlue }]} 
                    onPress={() => handleAcceptRequest(item.data)}
                  >
                    <Text style={styles.buttonText}>Aceptar</Text>
                  </TouchableOpacity>
                  
                </View>
              ) : null}
            </View>
          )}
        />
      ) : (
        <View>
          <Text style={styles.noNotifications}>No existen notificaciones aún</Text>
        </View>
      )}
    </View>
  );
};

export default Notifications;

const DynamicStyles = (Colors) => StyleSheet.create({
  h1: {
    color: Colors.text,
    fontFamily: "Raleway-Bold",
    fontSize: 30,
    paddingHorizontal: 20
  },
  notificationContainer: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    width,
    alignItems: "center",
    borderBottomColor:"black",
    borderBottomWidth:.5,
  },
  notificationText: {
    color: Colors.text,
    fontSize: 16,
    marginBottom: 10,
    maxWidth:250
  },
  chatButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5
  },
  requestButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  requestButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius:20
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold"
  },
  noNotifications: {
    color: Colors.text,
    fontSize: 18
  }
});
