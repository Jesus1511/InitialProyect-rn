import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import useColors from '../../../Utils/Colors'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'

const Login = () => {

  const navigation = useNavigation()
  const Colors = useColors()

  const styles = DynamicStyles(Colors)

  return (
    <View style={{backgroundColor:Colors.background, flex:1, padding:10}}>
        <View style={{ marginBottom: 15 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={28} color={Colors.text} />
          </TouchableOpacity>
        </View>
    </View>
  )
}

export default Login

const DynamicStyles = (Colors) => StyleSheet.create({

  text: {
      color:Colors.text,
      fontFamily:"Lato-Regular"
  }

})