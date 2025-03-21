import * as Font from 'expo-font';

export default loadFonts = async () => {
  await Font.loadAsync({
    'Raleway-ExtraBold': require('../assets/fonts/Raleway-ExtraBold.ttf'),
    'Raleway-Bold': require('../assets/fonts/Raleway-Bold.ttf'),
    'Raleway-SemiBold': require('../assets/fonts/Raleway-SemiBold.ttf'),


    'Nunito-Medium': require('../assets/fonts/Nunito-Medium.ttf'),
    'Nunito-Bold': require('../assets/fonts/Nunito-Bold.ttf'),


  });
  return
};
