import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import { FontAwesome } from '@expo/vector-icons';

const LoginScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { Msg, redirectTo, role, params } = route.params || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Google Sign-In setup
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID' // Replace with your Google Client ID
  });

  // Map roles to target screens
  const roleToScreen = {
    client: 'MainApp',
    trainer: 'TrainerDashboard',
    admin: 'AdminDashboard'
  };

  // Check if already authenticated
  useEffect(() => {
    if (auth.currentUser) {
      console.log('LoginScreen - User already authenticated:', auth.currentUser.uid);
      const targetScreen = roleToScreen[role] || 'MainApp';
      console.log('Navigating to:', targetScreen, { redirectTo, params });
      navigation.replace(targetScreen, {
        redirectTo,
        params,
        user: { uid: auth.currentUser.uid },
        userRole: role || 'client'
      });
    }
  }, [navigation, redirectTo, role, params]);

  // Handle Google Sign-In response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithGoogle(credential);
    }
  }, [response]);

  const signInWithGoogle = async (credential) => {
    setLoading(true);
    try {
      await signInWithCredential(auth, credential);
      console.log('Google Sign-In successful, user:', auth.currentUser.uid);
      const targetScreen = roleToScreen[role] || 'MainApp';
      console.log('Navigating to:', targetScreen, { redirectTo, params });
      navigation.replace(targetScreen, {
        redirectTo,
        params,
        user: { uid: auth.currentUser.uid },
        userRole: role || 'client'
      });
    } catch (error) {
      console.error('Google Sign-In error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Email Sign-In successful, user:', auth.currentUser.uid);
      const targetScreen = roleToScreen[role] || 'MainApp';
      console.log('Navigating to:', targetScreen, { redirectTo, params });
      navigation.replace(targetScreen, {
        redirectTo,
        params,
        user: { uid: auth.currentUser.uid },
        userRole: role || 'client'
      });
    } catch (error) {
      console.error('Email Sign-In error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{Msg || 'Welcome back!'}</Text>
      <Text style={styles.subtitle}>Enter your credentials to continue</Text>

      <TextInput
        mode="outlined"
        label="Enter email or phone"
        value={email}
        onChangeText={setEmail}
        left={<TextInput.Icon icon="account" />}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Password"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        style={styles.input}
      />

      <Text style={styles.forgotPassword}>Forgot password</Text>

      <Button
        mode="contained"
        loading={loading}
        style={styles.signInButton}
        onPress={handleLogin}
        disabled={loading}
      >
        Sign in
      </Button>

      <Button
        mode="contained"
        style={styles.googleButton}
        onPress={() => promptAsync()}
        disabled={loading || !request}
        icon={() => <FontAwesome name="google" size={20} color="white" />}
      >
        Log in with Google
      </Button>

      <Text style={styles.signupText}>
        Don't have an account?{' '}
        <Text style={styles.signupLink} onPress={() => navigation.navigate('Register')}>
          Sign up
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
    backgroundColor: 'white',
    justifyContent: 'start'
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold'
  },
  subtitle: {
    color: 'gray',
    marginBottom: 20
  },
  input: {
    marginBottom: 10
  },
  forgotPassword: {
    textAlign: 'right',
    color: 'gray'
  },
  signInButton: {
    backgroundColor: '#F7941D',
    marginVertical: 10
  },
  googleButton: {
    backgroundColor: 'gray',
    marginVertical: 5
  },
  signupText: {
    textAlign: 'center',
    marginTop: 20
  },
  signupLink: {
    color: '#F7941D',
    fontWeight: 'bold'
  }
});

export default LoginScreen;