import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { auth } from '../firebase/firebaseConfig';
import { signInWithPhoneNumber } from 'firebase/auth';
import { useAuthStore } from '../store/useAuthStore';

const PhoneInputScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaVerifier = useRef(null);
  const setConfirmationResult = useAuthStore((state) => state.setConfirmationResult);

  const handleSendCode = async () => {
    if (!phone || (!phone.startsWith('+256') && !phone.startsWith('0'))) {
      Alert.alert('Error', 'Phone number must start with +256 or 0');
      return;
    }

    const formattedPhone = phone.startsWith('0') ? '+256' + phone.slice(1) : phone;

    try {
      setLoading(true);
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifier.current
      );
      setConfirmationResult(confirmation);
      navigation.navigate('OTPVerifyScreen', { phone: formattedPhone });
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
      />
      <Text variant="titleLarge" style={styles.title}>Login with Phone</Text>
      <TextInput
        label="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        mode="outlined"
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleSendCode}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Send OTP
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

export default PhoneInputScreen;
