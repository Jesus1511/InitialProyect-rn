import React, { useState, useEffect } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

const LoadingBox = ({ width, height, radius }) => {
    
  const [visible, setVisible] = useState(true);
  const opacity1 = new Animated.Value(1);
  const opacity0 = new Animated.Value(0.3);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(prev => !prev); // Alternar visibilidad cada 800ms
    }, 600);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity1, {
        toValue: 0.5,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true, 
      }).start();
    } else {
      Animated.timing(opacity0, {
        toValue: 1,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true, 
      }).start();
    }
  }, [visible]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.box,
          { opacity:visible?opacity1:opacity0, width, height, borderRadius: radius, backgroundColor: '#00000009' },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({

});

export default LoadingBox;
