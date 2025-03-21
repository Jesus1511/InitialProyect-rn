import React, { useRef, useEffect } from 'react';
import { View, Animated, Image, StyleSheet, Dimensions } from 'react-native';

import we1 from '../../assets/images/we1.png';
import we2 from '../../assets/images/we2.png';
import we3 from '../../assets/images/we3.png';
import we4 from '../../assets/images/we4.png';

const images = [we1, we2, we3, we4];
const IMAGE_WIDTH = 200; // Ancho de cada imagen
const DURATION = 10000; // Duración de la animación en ms

const Carousel = () => {
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      scrollX.setValue(0); // Reiniciar posición

      Animated.timing(scrollX, {
        toValue: -IMAGE_WIDTH - 10 * images.length, // Mover todo el carrusel
        duration: DURATION,
        useNativeDriver: true,
      }).start(() => animate()); // Reiniciar animación cuando termine
    };

    animate();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.carousel,
          { transform: [{ translateX: scrollX }] }
        ]}
      >
        {/* Se duplican las imágenes para efecto de loop */}
        {[...images, ...images].map((image, index) => (
          <Image key={index} source={image} style={styles.image} />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    overflow: 'hidden',
  },
  carousel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: IMAGE_WIDTH,
    height: 300,
    marginHorizontal:10,
    resizeMode: 'cover',
  },
});

export default Carousel;
