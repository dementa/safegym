import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuthStore } from '../store/useAuthStore';

const OTPVerifyScreen = ({ navigation }) => {
  const [code, setCode] = useState('');
  const confirmationResult = useAuthStore((state) => state.confirmationResult);
  const clearConfirmationResult = useAuthStore((state) => state.clearConfirmationResult);
  const setUser = useAuthStore((state) => state.setUser); // Zustand action

  const verifyCode = async () => {
    try {
      const result = await confirmationResult.confirm(code);

      if (!result?.user) {
        throw new Error("Verification succeeded but user data is missing.");
      }

      const user = result.user;

      setUser(user); // optional if you're using Zustand to store globally
      clearConfirmationResult();

      Alert.alert('Success', 'Phone number verified!');

      // Navigate to UserDetails screen with user data
      navigation.navigate('UserDetails', { user });

    } catch (error) {
      Alert.alert('Invalid OTP', error.message || 'Please check the code and try again.');
      console.error("OTP Verification Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Enter OTP</Text>
      <TextInput
        label="OTP Code"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
        mode="outlined"
        style={styles.input}
        maxLength={6}
      />
      <Button
        mode="contained"
        onPress={verifyCode}
        style={styles.button}
      >
        Verify
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { marginBottom: 24, textAlign: 'center', color: '#FF6F00' },
  input: { marginBottom: 16 },
  button: { backgroundColor: '#FF6F00' },
});

export default OTPVerifyScreen;
