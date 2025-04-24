// screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen(props) {
  // Use either the navigation prop or the hook fallback
  const navigation = props.navigation || useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (navigation?.replace) {
        navigation.replace('Welcome'); // Navigate only if available
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
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
    backgroundColor: '#F7941D',
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
