import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { useAuthStore } from '../store/useAuthStore'; // Assuming it holds user info
import { uploadImageAsync } from '../utils/uploadImage'; // You’ll create this
import { useNavigation } from '@react-navigation/native';

const UserDetailsScreen = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = useAuthStore((state) => state.user); // Phone user from Firebase auth
  const setUser = useAuthStore((state) => state.setUser);
  const navigation = useNavigation();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const generateGymNumber = async () => {
    const snapshot = await getDocs(query(collection(db, "users"), orderBy("gymNumber")));
    const count = snapshot.size + 1;
    return `GYM${count.toString().padStart(3, '0')}`;
  };

  const handleSubmit = async () => {
    if (!email || !username) {
      Alert.alert("Missing Info", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const photoURL = image ? await uploadImageAsync(image) : null;
      const gymNumber = await generateGymNumber();

      const docRef = await addDoc(collection(db, "users"), {
        uid: user.uid,
        email,
        username,
        gymNumber,
        photoURL,
        phoneNumber: user.phoneNumber,
        createdAt: new Date(),
      });

      // Save in Zustand
      setUser({ uid: user.uid, email, username, gymNumber, photoURL });

      Alert.alert("Welcome!", `Your gym number is ${gymNumber}`);
      navigation.replace("MainApp"); // Now they're fully registered and logged in
    } catch (err) {
      console.error("Error saving user:", err);
      Alert.alert("Error", "Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Complete Your Profile</Text>

      <Avatar.Image 
        source={image ? { uri: image } : require('../assets/avatar-placeholder.png')} 
        size={100} 
        style={{ alignSelf: 'center', marginBottom: 16 }}
      />
      <Button mode="outlined" onPress={pickImage}>Upload Profile Picture</Button>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        style={styles.button}
      >
        Save & Continue
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 16 },
  button: { marginTop: 20, backgroundColor: '#FF6F00' },
});

export default UserDetailsScreen;
