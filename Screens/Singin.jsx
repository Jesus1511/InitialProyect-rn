import { StyleSheet, View, TouchableOpacity, StatusBar } from 'react-native'
import { useState, useContext } from 'react'
import { UserContext } from '../Navigation'
import useColors from '../Utils/Colors'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import { usePost } from '../Utils/usePost'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'

import NameStep from '../components/singin/NameStep'
import AboutYouStep from '../components/singin/AboutYouStep'
import LastStep from '../components/singin/LastStep'

const Singin = () => {

    const {setUser} = useContext(UserContext)
    
    const Colors = useColors()
    const navigation = useNavigation();
    const styles = DynamicStyles(Colors)

    const [screen, setScreen] = useState(0);
  
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const [preferences, setPreferences] = useState([])
    const [languages, setLanguages] = useState([])
    const [ages, setAges] = useState([])

    const [expoPushToken, setExpoPushToken] = useState(null);
    const [location, setLocation] = useState(null)
    const [singing, setSinging] = useState(false);
  
  
    async function singin () {
        try {
          setSinging(true);

          const response = await usePost('/auth/singin', {
            name,
            email,
            password: pass,
            preferences,
            languages,
            ages,
            expoPushToken,
            ubication: location
          })

          if (response.error) {
             Toast.show({
               type: 'error',
               text1: response.error,
               visibilityTime: 2000, 
               autoHide: true,
             });
          } else if (response) {
             console.log('Usuario creado', response)
             const response2 = await usePost('/auth/login', {
              email: response.user.email,
              password: pass
             })
             console.log(response2)
             await AsyncStorage.setItem('token', response2.token)
             setUser(response.user)
             navigation.navigate('HomeScreen')
          }

          } finally {
            setSinging(false)
          }
    }

    function next() {
      if (screen < 2) {
        setScreen(prevScreen => prevScreen + 1);
        return;
      }
      singin()
    }
    
    function back() {
      if (screen === 0) navigation.goBack();
      setScreen(prevScreen => prevScreen - 1);
    }


  return (
    <View style={{backgroundColor:Colors.background, flex:1, padding:10}}>
        <StatusBar backgroundColor={Colors.background}/>
        <View style={{ marginBottom: 15 }}>
          <TouchableOpacity onPress={() => back()}>
            <AntDesign name="arrowleft" size={28} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {screen == 0 && (
          <NameStep
            name={name} setName={setName}
            email={email} setEmail={setEmail}
            pass={pass} setPass={setPass}
            next={next}
            />
        )}

        {screen == 1 && (
          <AboutYouStep
            languages={languages} setLanguages={setLanguages}
            preferences={preferences} setPreferences={setPreferences}
            ages={ages} setAges={setAges}
            next={next}
            />
        )}

        {screen == 2 && (
          <LastStep
            token={expoPushToken} setToken={setExpoPushToken}
            location={location} setLocation={setLocation}
            next={next} singing={singing}
            />
        )}
    </View>
  )
}

export default Singin

const DynamicStyles = (Colors) => StyleSheet.create({


})