import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, createContext, useState } from 'react';
import { usePost } from './Utils/usePost'
import { View, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import loadFonts from './Utils/Fonts'

import WelcomeScreen from './Screens/WelcomeScreen';

const Stack = createStackNavigator();
const UserContext = createContext()

const Navigations = () => {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [initialRoute, setInitialRoute] = useState("WelcomeScreen")

  useEffect(() => {
    async function initializeApp() {
      try {
        //await SplashScreen.preventAutoHideAsync();
        await loadFonts();

        const response = await usePost('/auth/whoAmI');
        
        if (!response) {
          setInitialRoute("WelcomeScreen");
          return;
        }

        setUser(response.user);
        setInitialRoute("HomeScreen");

      } catch (error) {
        setInitialRoute("WelcomeScreen");
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
    <NavigationContainer>
      <UserContext.Provider value={{user, setUser}}>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRoute={initialRoute}>
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        </Stack.Navigator>
      </UserContext.Provider>
    </NavigationContainer>
  );
};

export default Navigations;
