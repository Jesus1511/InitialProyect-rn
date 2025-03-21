import { StyleSheet, View, Animated, TouchableOpacity, Text, TextInput, ScrollView } from 'react-native'
import { useRef, useEffect, useState } from 'react'
import useColors from '../../Utils/Colors'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome6, Entypo, AntDesign } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { edades, preferencias, lenguajes } from '../../Utils/Consts';

const AboutYouStep = ({ preferences, setPreferences, languages, setLanguages, ages, setAges, next }) => {
    
  const navigation = useNavigation();
  const Colors = useColors();

  const [search, setSearch] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const styles = DynamicStyles(Colors);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  function handleNext() {
    if (preferences.length < 1 || languages < 1 || ages < 1) {
      Toast.show({
        type: 'error',
        text1: 'Selecciones al menos 1 de cada uno',
        visibilityTime: 2000, 
        autoHide: true,
      }); return; }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      next();
    }, 700);
  }

  const toggleSelection = (item, list, setList) => {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const filteredLanguages = lenguajes.filter((item) => item.toLowerCase().includes(search.toLowerCase()));
  const filteredAges = edades.filter((item) => item.toLowerCase().includes(search.toLowerCase()));
  const filteredPreferences = preferencias.filter((item) => item.toLowerCase().includes(search.toLowerCase()));
  
  return (
    <Animated.View style={{ backgroundColor: Colors.background, flex: 1, opacity: fadeAnim, padding: 10 }}>
      <Text style={styles.h1}>Cuéntanos más de ti</Text>

      <ScrollView style={styles.scroll}>

        <TextInput
          value={search}
          onChangeText={(text) => setSearch(text)}
          style={styles.SearchBar}
          placeholder='Buscar'
        />

        <View style={{ flexDirection: "row" }}>
          <FontAwesome6 name="language" size={30} color="black" />
          <Text style={styles.categoryText}>Idiomas</Text>
        </View>

        <View style={styles.elementContainer}>
          {filteredLanguages.map((len) => (
            <TouchableOpacity 
              key={len} 
              style={[styles.element, { backgroundColor: languages.includes(len) ? Colors.yellow : "white" }]} 
              onPress={() => toggleSelection(len, languages, setLanguages)}
            >
              <Text>{len}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flexDirection: "row" }}>
          <Entypo name="calendar" size={30} color="black" />
          <Text style={styles.categoryText}>Edades</Text>
        </View>

        <View style={styles.elementContainer}>
          {filteredAges.map((len) => (
            <TouchableOpacity 
              key={len} 
              style={[styles.element, { backgroundColor: ages.includes(len) ? Colors.yellow : "white" }]} 
              onPress={() => toggleSelection(len, ages, setAges)}
            >
              <Text>{len}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flexDirection: "row" }}>
          <AntDesign name="heart" size={30} color="black" />
          <Text style={styles.categoryText}>Temas</Text>
        </View>

        <View style={styles.elementContainer}>
          {filteredPreferences.map((len) => (
            <TouchableOpacity 
              key={len} 
              style={[styles.element, { backgroundColor: preferences.includes(len) ? Colors.yellow : "white" }]} 
              onPress={() => toggleSelection(len, preferences, setPreferences)}
            >
              <Text>{len}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      <View style={{ alignItems: "center" }}>
        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default AboutYouStep;

const DynamicStyles = (Colors) => StyleSheet.create({

  h1: {
    textAlign:"left",
    fontFamily:"Raleway-ExtraBold",
    fontSize:40,
    marginBottom:25,
    color:Colors.text
  },
  button: {
    width:313,
    height:56,
    borderRadius:30,
    backgroundColor:Colors.yellow
  },
  buttonText: {
   fontSize:24,
   textAlign:"center",
   fontFamily:"Raleway-Bold",
   textAlignVertical:"center",
   height:"100%" 
  },
  SearchBar: {
    width:330,
    height:50,
    backgroundColor:"#385DAE13",
    borderRadius:20,
    paddingHorizontal:20,
    fontFamily:"Nunito-Medium",
    fontSize:24,
    marginBottom:15
  },
  categoryText: {
    fontFamily:"Raleway-Bold",
    fontSize:20,
    marginLeft:10
  },

  element: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin:3,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:10,
    elevation:5
  },

  elementContainer: {
    flexDirection:"row",
    flexWrap:"wrap",
    marginVertical:10
  }

})