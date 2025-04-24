import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import UploadMediaFiles from '../src';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/featured.png')} 
        style={styles.image} 
      />
      <Text style={styles.title}>Let’s</Text>
      <Text style={styles.subtitle}>Get Started<Text style={{ color: '#F7941D' }}>.</Text></Text>
      <Text style={styles.description}>All gym appointments in one place</Text>
      
      <Button mode="contained" style={styles.loginButton} onPress={() => navigation.navigate('HomeScreen')}>
        Continue
      </Button>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'start',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
  },
  description: {
    fontSize: 16,
    color: 'gray',
    marginVertical: 10,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#F7941D',
    marginVertical: 10,
    marginTop: 20,
  },
  createAccountButton: {
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    marginVertical:10,
  },
  card: {
    margin: 10,
    padding: 5,
    borderRadius: 10,
  },
  phone: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contact: {
    color: "blue",
  },
  time: {
    fontSize: 14,
    color: "#666",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  status: {
    color: "#F7941D",
    fontWeight: "bold",
    marginLeft: "auto",
  },
});

export default WelcomeScreen;
