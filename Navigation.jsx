import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, createContext, useState } from 'react';
import { usePost } from './Utils/usePost'
import { View, Image } from 'react-native';
import loadFonts from './Utils/Fonts'
import NavBar from './components/NavBar';

import WelcomeScreen from './Screens/WelcomeScreen';
import Login from './Screens/Login';
import Singin from './Screens/Singin'
import HomeScreen from './Screens/HomeScreen'
import ChatsScreen from './Screens/ChatsScreen'
import ProfileScreen from './Screens/ProfileScreen';
import MapScreen from './Screens/MapScreen'
import Configuration from './Screens/Configuration'
import Notifications from './Screens/Notifications';
import CreateEvent from './Screens/CreateEvent';
import UserProfile from './Screens/UserProfile';

import Chat from './components/ChatScreen/Chat'
import Event from './components/Events/Event'

const Stack = createStackNavigator();
export const UserContext = createContext()

const Navigations = () => {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [initialRoute, setInitialRoute] = useState("WelcomeScreen")

  const [users, setUsers] = useState(null)
  const [events, setEvents] = useState(null)
  const [receivedRequests, setReceivedRequests] = useState("")
  const [sendedRequests, setSendedRequests] = useState("")
  const [chats, setChats] = useState(null)
  const [requestChats, setRequestChats] = useState(null)
  const [notifications, setNotifications] = useState([])

  const getUsers = async (level) => {
    const response = await usePost("/auth/getFeedUsers", {
      zone: user?.ubication[level],
      zoneFilterLevel: level
    });
    if (response.error) {
      console.error(error)
      setUser([])
    }
    else if (response.users) {
      setUsers(response.users);
    } 
    
  };
  
  const getEvents = async (level) => {
    const response = await usePost("/events/getFeedEvents", {
      zone: user?.ubication[level],
      zoneFilterLevel: level
    })
    if (response.error) {
      console.error(error)
      setEvents([])
    }
    else if (response.events) {
      setEvents(response.events)
    } 
    
  }

  const getRequests = async () => {
    const response = await usePost("/requests/getAllMy", {})
    if (response) {
      setSendedRequests(response.sentRequests)
      setReceivedRequests(response.receivedRequests)
    }
  }

  const getChats = async () => {
    const response = await usePost('/chat/getMyChats', {});
    if (response.error) {
      console.error(error)
      setChats([])
      setRequestChats([])
    }
    if (response) {
      setChats(response.chats);
      setRequestChats(response.requestsChats)
      obtenerDatosDeUsuarios(response.chats);
    }
  };

  const loadData = (level) => {
    getUsers(level)
    getEvents(level)
    getRequests()
    getChats()
  }

  useEffect(() => {
    console.log("receivedRequests", receivedRequests);
    console.log("chats", chats);
    
    if ((receivedRequests && receivedRequests.length > 0) || (chats && chats.length > 0)) {
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.data._id)); // Obtiene los IDs ya existentes
        
        const newNotifications = [];
        
        if (receivedRequests && receivedRequests.length > 0) {
          newNotifications.push(
            ...receivedRequests
              .filter(request => !existingIds.has(request._id))
              .map(request => ({
                type: 'friend_request',
                description: `${request.user.name} te ha enviado una solicitud de amistad.`,
                data: request,
              }))
          );
        }
        
        if (chats && chats.length > 0) {
          newNotifications.push(
            ...chats
              .filter(chat => chat.notReadedMessages > 0 && !existingIds.has(chat._id))
              .map(chat => ({
                type: 'chat_message',
                description: `Tienes ${chat.notReadedMessages} mensajes sin leer en el chat con ${chat.contactName}.`,
                data: chat,
              }))
          );
        }
        
        return [...prev, ...newNotifications];
      });
    }
  }, [receivedRequests, chats]);
  
  
  

  useEffect(() => {
    async function initializeApp() {
      try {
        await loadFonts();
        const response = await usePost('/auth/whoAmI');
  
        if (response?.user) {
          setUser(response.user);
          setInitialRoute("HomeScreen");
        }
  
      } catch (error) {
        console.error("Error initializing the app:", error);
      } finally {
        setLoading(false);
      }
    }
  
    initializeApp();
  }, []);

  if (loading) {
    return (
      <View style={{justifyContent:"center", flex:1, alignItems:"center"}}>
        <Image //source={icon}
         style={{width:230, height:230, borderRadius:30, elevation:7}}/>
      </View>
    ); 
  }

  return (
    <NavigationIndependentTree>
      <NavigationContainer key={initialRoute}>
        <UserContext.Provider value={{ user, setUser, users, events, notifications, setNotifications, chats, requestChats, loadData, setUsers, sendedRequests, setSendedRequests, receivedRequests }}>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Singin" component={Singin} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="ChatsScreen" component={ChatsScreen} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="MapScreen" component={MapScreen} />
            <Stack.Screen name="Configuration" component={Configuration} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="CreateEvent" component={CreateEvent} />
            <Stack.Screen name="Event" component={Event} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
          </Stack.Navigator>

          {user && (
            <NavBar />
          )}

        </UserContext.Provider>
      </NavigationContainer>
    </NavigationIndependentTree>
    
  );
};

export default Navigations;
