import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, TouchableRipple, Dialog, Portal } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { FontAwesome } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
  const { email, phone, password, pwd, username, setUsername, setEmail, setPhone, setPassword, setPwd, loading, login, showPassword, togglePasswordVisibility, verifyPassword, errorMsg, removeError, registerUser, createAccount} = useAuthStore();
  const [signupMethod, setSignupMethod] = useState("email");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account!</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <View style={styles.toggleContainer}>
        <TouchableRipple
          onPress={() => setSignupMethod("email")}
          style={[
            styles.toggleButton,
            signupMethod === "email" && styles.activeButton,
          ]}
        >
          <Text style={signupMethod === "email" ? styles.activeText : styles.inactiveText}>
            Email
          </Text>
        </TouchableRipple>
        <TouchableRipple
          onPress={() => setSignupMethod("phone")}
          style={[
            styles.toggleButton,
            signupMethod === "phone" && styles.activeButton,
          ]}
        >
          <Text style={signupMethod === "phone" ? styles.activeText : styles.inactiveText}>
            Phone number
          </Text>
        </TouchableRipple>
      </View>

      {signupMethod === "email" ? (
      <TextInput
        mode="outlined"
        label="Enter email"
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        left={<TextInput.Icon icon="account" />}
        style={styles.input}
      />
      ) : (
        <View>

          <TextInput
            mode="outlined"
            label="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType='numeric'
            left={<TextInput.Icon icon="phone" />}
            style={styles.input}
          />
        </View>
      )}

      <TextInput
        mode="outlined"
        label="Enter your username"
        value={username}
        onChangeText={setUsername}
        left={<TextInput.Icon icon="pen" />}
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
      <TextInput
        mode="outlined"
        label="Confirm Password"
        secureTextEntry={!showPassword}
        value={pwd}
        onChangeText={setPwd}
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon 
            icon={showPassword ? "eye-off" : "eye"} 
            onPress={togglePasswordVisibility} 
          />
        }
        style={styles.input}
      />

      {errorMsg && (
      <View style={{ padding: 20 }}>
        <Portal>
          <Dialog visible={true} onDismiss={removeError}>
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
              <Text>{errorMsg}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={removeError}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
      )}
      
      <Button mode="contained" loading={loading} style={styles.signInButton} onPress={() => createAccount(navigation)}>
        Create Account
      </Button>

      {/* Auth Provider buttons below */}

      <Button mode="contained" style={styles.appleButton} icon={() => <FontAwesome name="apple" size={20} color="white" />}>
        Sign up with Apple
      </Button>
      
      <Button mode="contained" style={styles.googleButton} icon={() => <FontAwesome name="google" size={20} color="white" />}>
        Sign up with Google
      </Button>

      <Text style={styles.signupText}>
        Already registered <Text style={styles.signupLink} onPress={() => navigation.navigate('Login')}>Log in</Text>
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
  toggleContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#444",
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  inactiveText: {
    color: "#777",
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

export default RegisterScreen;
