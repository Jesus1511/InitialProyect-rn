import { StyleSheet, View, TouchableOpacity } from 'react-native';
import useColors from '../Utils/Colors';
import { Entypo, FontAwesome5, FontAwesome,  } from '@expo/vector-icons';
import { useNavigation, useNavigationState } from '@react-navigation/native';

export const NavBar = () => {

  const navigation = useNavigation();
  const Colors = useColors();
  
  // Obtener el nombre de la ruta actual
  const currentRoute = useNavigationState((state) => state?.routes[state.index]?.name);

  if (currentRoute == "Configuration" || currentRoute == "Chat" || currentRoute == "Notifications") {
    return (
      <View />
    )
  }

  return (
    <View style={{ height: 70, justifyContent: "space-evenly", flexDirection: "row", backgroundColor: Colors.background }}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('HomeScreen')} 
        style={{ justifyContent: "center", alignItems: "center", width: 60 }}>
        <Entypo 
          name="home" 
          size={currentRoute == "HomeScreen" ? 42:32} 
          color={Colors.text}
        />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('MapScreen')} 
        style={{ justifyContent: "center", alignItems: "center", width: 60 }}>
        <FontAwesome5
            name="map-marked-alt"
            size={currentRoute == "MapScreen" ? 42:32} 
            color={Colors.text}
        />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('ChatsScreen')} 
        style={{ justifyContent: "center", alignItems: "center", width: 60 }}>
        <Entypo
          name="message"
          size={currentRoute == "ChatsScreen" ? 42:32} 
          color={Colors.text}
          />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('ProfileScreen')} 
        style={{ justifyContent: "center", alignItems: "center", width: 60 }}>
        <FontAwesome 
          name="user" 
          size={currentRoute == "ProfileScreen" ? 42:32} 
          color={Colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

export default NavBar


const styles = StyleSheet.create({});
