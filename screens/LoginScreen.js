import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { FontAwesome } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { signInWithGoogle } from '../libs/authProvider';

const LoginScreen = ({ navigation }) => {
  const router = useRoute();
  const { Msg } = router.params || {};

  const { email, password, setEmail, setPassword, loading, login, showPassword, togglePasswordVisibility} = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ Msg || ("Welcome back!")}</Text>
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
            icon={showPassword ? "eye-off" : "eye"} 
            onPress={togglePasswordVisibility} 
          />
        }
        style={styles.input}
      />


      <Text style={styles.forgotPassword}>forgot password</Text>
      
      <Button mode="contained" loading={loading} style={styles.signInButton} onPress={() => login(navigation)}>
        Sign in
      </Button>

      <Button mode="contained" style={styles.appleButton} icon={() => <FontAwesome name="apple" size={20} color="white" />}>
        Log in with Apple
      </Button>
      
      <Button mode="contained" style={styles.googleButton} onPress={()=>signInWithGoogle(navigation)} icon={() => <FontAwesome name="google" size={20} color="white" />}>
        Log in with Google
      </Button>

      <Text style={styles.signupText}>
        Don’t have an account? <Text style={styles.signupLink} onPress={() => navigation.navigate('Register')}>signup</Text>
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
    justifyContent: 'start',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'gray',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  forgotPassword: {
    textAlign: 'right',
    color: 'gray',
  },
  signInButton: {
    backgroundColor: 'orange',
    marginVertical: 10,
  },
  appleButton: {
    backgroundColor: 'black',
    marginVertical: 5,
  },
  googleButton: {
    backgroundColor: 'gray',
    marginVertical: 5,
  },
  signupText: {
    textAlign: 'center',
    marginTop: 20,
  },
  signupLink: {
    color: 'orange',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
