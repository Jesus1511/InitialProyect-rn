import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Callout, Marker } from 'react-native-maps';

export default function EventCustomMarker({ coordinate, title, image, showDetails }) {
  return (
    <Marker coordinate={coordinate} onPress={showDetails}>
      
    </Marker>
  );
}

const styles = StyleSheet.create({
  calloutContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  calloutText: {
    fontWeight: 'bold',
    color: 'black',
  },
});

  