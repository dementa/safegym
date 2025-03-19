// screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // After 3 seconds, replace the splash screen with the Welcome screen
      navigation.replace('Welcome');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Logo centered */}
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      {/* Spinning loader at the bottom */}
      <ActivityIndicator 
        animating={true} 
        size="large" 
        color="white" 
        style={styles.loader} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  loader: {
    position: 'absolute',
    bottom: 50,
  },
});
