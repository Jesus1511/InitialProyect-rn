import { StyleSheet, View, TouchableOpacity, Image, TextInput, Text, ScrollView } from 'react-native'
import { useState } from 'react'
import useColors from '../Utils/Colors'
import { useNavigation } from '@react-navigation/native'
import { AntDesign, Fontisto, FontAwesome } from '@expo/vector-icons'
import DateTimePicker from "@react-native-community/datetimepicker";
import checkIcon from '../assets/images/check-icon.png'
import Map from '../components/Events/Map'
import Toast from 'react-native-toast-message'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system'
import { usePost } from '../Utils/usePost'

const CreateEvent = () => {

  const navigation = useNavigation()
  const Colors = useColors()
  const styles = DynamicStyles(Colors)
  
  const [image, setImage] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date"); 
  const [mapOpen, setMapOpen] = useState(false)
  const [location, setLocation] = useState(null)
  
  const onChange = (event, selectedDate) => {
    if (!selectedDate) return;
  
    const now = new Date();
    
    if (mode === "date") {
      if (selectedDate < now.setHours(0, 0, 0, 0)) {
        // Evita seleccionar días anteriores
        setDate(new Date());
      } else {
        setDate(selectedDate);
      }
      setMode("time"); // Cambia a selección de hora
      setShow(true); // Muestra nuevamente el picker
    } else {
      const selectedTime = new Date(date);
      selectedTime.setHours(selectedDate.getHours(), selectedDate.getMinutes());
  
      if (date.toDateString() === now.toDateString() && selectedTime < now) {
        // Evita seleccionar horas pasadas en el día de hoy
        setTime(now);
      } else {
        setTime(selectedTime);
      }
      setShow(false);
    }
  };
  
  const showPicker = () => {
    setMode("date");
    setShow(true);
  };

  const uploadImage = async (imageUri) => {
    try {
      const resizedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }], // Ajusta el ancho según tus necesidades
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Ajusta la compresión
      );

      let base64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      base64 =  `data:image/jpeg;base64,${base64}`
     
      const response = await usePost('/auth/uploadImage', { base64 });
  
      if (response.error) {
        Toast.show({
          type:"error",
          text1:response.error,
          visibilityTime: 2000,
          autoHide: true
        }); return
      }
      
      setImage(response.image)
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

  const handlePublish = async () => {
    if ( name == "" || description == "" || !location) {
      Toast.show({
        type: 'error',
        text1: 'Rellene todos los campos',
        visibilityTime: 2000, 
        autoHide: true,
      }); return;
    }

    const response = await usePost('/events/create', {
      name, description, location,
      date: date.toDateString(), time: time.toTimeString(), image
    })

    console.log("response", response)

    if (response.error) {
      Toast.show({
        type: 'error',
        text1: response.error,
        visibilityTime: 2000, 
        autoHide: true,
      }); return;
    }

    Toast.show({
      text1: 'Evento: "' + name + '". creado exitosamente',
      visibilityTime: 4000, 
      autoHide: true,
    });
    navigation.navigate("HomeScreen")
  }

  return (
    <ScrollView style={{backgroundColor:Colors.background, flex:1}}>
      <View style={{alignItems:"center"}}>

        <View style={{ marginBottom: 15, width:"100%", padding:10}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={28} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => pickImage([1850,1350])} style={styles.pressableImage}>
            {image?(
              <Image style={{width:"100%", height:"100%"}} source={{uri:image}}/>
            ):(
              <View style={{width:"100%", height:"100%", justifyContent:"center", alignItems:"center"}}>
               <FontAwesome name="photo" size={75} color={"white"} />
              </View>
            )}
        </TouchableOpacity>

        <TextInput 
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder='Nombre'
          placeholderTextColor={Colors.placeholder}
          />
        <TextInput 
          style={[styles.input, {height:150, textAlignVertical:"top"}]}
          value={description}
          onChangeText={(text) => setDescription(text)}
          placeholder='Descripción'
          multiline
          placeholderTextColor={Colors.placeholder}
          />
        
        <View style={{borderRadius:20, overflow: 'hidden', marginVertical:15}}>
            <View style={styles.hourContainer}>
                <Text style={{textAlign:"center", fontSize:18}}>{date.toDateString()}</Text>
                <Text style={{textAlign:"center", fontSize:18}}>{time.toLocaleTimeString()}</Text>
            </View>
            <TouchableOpacity onPress={showPicker} style={styles.selectHour}>
                <Text style={{textAlign:"center", fontSize:18, color:"white"}}>Seleccionar fecha y hora</Text>
            </TouchableOpacity>
        </View>

        {show && (
          <DateTimePicker
            value={mode === "date" ? date : time}
            mode={mode}
            display="default"
            is24Hour={true}
            onChange={onChange}
            minimumDate={new Date()} 
          />
        )}
      
        <TouchableOpacity style={styles.selectLocationButton} onPress={() => setMapOpen(!mapOpen)}>
            <Text style={{color:Colors.text, fontSize:20, marginRight:20}}>Seleccionar Ubicación</Text>
            <Fontisto name={mapOpen?"angle-up":"angle-down"} size={24} color="black" />
            {location && (
              <Image style={{width:25, height:25, marginLeft:15}} source={checkIcon}/>
            )}
        </TouchableOpacity>

        {mapOpen && (
          <Map width={360} height={250} setLocation={setLocation}/>
        )}

        <TouchableOpacity onPress={handlePublish} style={styles.publishButton}>
            <Text style={styles.publishButtonText}>Publicar Evento</Text>
        </TouchableOpacity>

        <View style={{height:40}}/>
      </View>
    </ScrollView>
  )
}

export default CreateEvent

const DynamicStyles = (Colors) => StyleSheet.create({
  pressableImage: {
    width:"100%",
    backgroundColor:"gray",
    height:220,
    marginBottom:20
  },
  input: {
    width:329,
    height:59,
    borderColor:Colors.mainBlue,
    borderWidth:2,
    marginBottom:20,
    borderRadius:20,
    padding:12,
    fontSize:20,
    fontFamily:"Nunito-Bold",
    color:Colors.Text
  },
  selectHour: {width:300, backgroundColor:Colors.mainBlue, flexDirection:"row", justifyContent:"space-evenly", padding:10},
  hourContainer: {width:300, backgroundColor:"#b4b4b42c", flexDirection:"row", justifyContent:"space-evenly", padding:10},
  selectLocationButton: {
    width:"100%",
    borderRadius:15,
    paddingHorizontal:30,
    paddingVertical:15,
    flexDirection:"row",
    alignItems:"center"
  },
  publishButton: {
    backgroundColor:Colors.yellow,
    paddingHorizontal:80,
    borderRadius:20,
    paddingVertical:15,
    marginTop:40
  },
  publishButtonText: {
    fontSize:20,
    fontFamily:"Raleway-Bold"
  }
})
