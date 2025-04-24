import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { auth } from '../firebase/firebaseConfig';

export default function RoleSelectScreen({ navigation }) {
  const handleSelectRole = (role, targetScreen) => {
    console.log('RoleSelectScreen - Selected role:', role, 'Navigating to Login');
    navigation.navigate('Login', {
      role,
      redirectTo: targetScreen,
      user: { uid: auth.currentUser?.uid },
      userRole: role
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo2.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to Our Gym</Text>
      <Text style={styles.subtitle}>To continue, please select your role</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#F7941D' }]}
        onPress={() => handleSelectRole('client', 'MainApp')}
      >
        <Text style={styles.buttonText}>Login as Client</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#333' }]}
        onPress={() => handleSelectRole('trainer', 'TrainerDashboard')}
      >
        <Text style={styles.buttonText}>Login as Trainer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#CCC' }]}
        onPress={() => handleSelectRole('admin', 'AdminDashboard')}
      >
        <Text style={styles.buttonText2}>Login as Admin</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLink}>
          Want to become a member? <Text style={styles.linkText}>Register here</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  logo: {
    width: 200,
    height: 200
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666'
  },
  button: {
    width: '80%',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  buttonText2: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600'
  },
  registerLink: {
    marginTop: 30,
    fontSize: 14,
    color: '#333'
  },
  linkText: {
    color: '#007BFF',
    fontWeight: 'bold'
  }
});