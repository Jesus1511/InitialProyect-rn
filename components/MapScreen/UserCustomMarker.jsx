import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';
import { Callout, Marker } from 'react-native-maps';

export default function UserCustomMarker({ coordinate, title, image, showDetails }) {

  return (
    <Marker 
        coordinate={coordinate}
        onPress={() => {
            showDetails();
        }}
    >
        <TouchableOpacity style={styles.markerContainer}>
            <Image source={{uri:image}} style={styles.markerImage} />
            <View style={{
                width:25, height:25, borderRadius:20, backgroundColor:"#3fdd33", 
                position:"absolute", bottom:0, right: 0,
            }}>
                <Entypo name="plus" size={25} color="white" />
            </View>
        </TouchableOpacity>

        <Callout tooltip>
            <View>
                <Text>{title}</Text>
            </View>
        </Callout>
    </Marker>

  )
}

const styles = StyleSheet.create({
    
    markerImage: {
      width: 45, 
      height: 45,
      backgroundColor:"#b4b4b4",
      borderRadius: 50,
    },
    markerContainer: {
        width: 50,
        height: 50,
        // position: 'absolute',
        // top: 120,
    }
  });
  