import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, Menu } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../../firebase/firebaseConfig';
import { collection, addDoc, } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const specializations = [
  'Weight Training', 'Cardio Fitness', 'Yoga', 'Pilates',
  'CrossFit', 'Strength & Conditioning', 'Zumba',
  'Bodybuilding', 'HIIT', 'Rehabilitation'
];

const generateTrainerID = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

const EnrollTrainerScreen = ({navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [4, 4],
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const isValidPhone = (value) => value.startsWith('0') || value.startsWith('+256');

  const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    return await response.blob();
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !speciality || !phone || !imageUri) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
  
    if (!isValidPhone(phone)) {
      Alert.alert("Invalid Phone", "Phone number must start with 0 or +256.");
      return;
    }
  
    if (!speciality) {
      Alert.alert("Specialization Missing", "Please select a specialization.");
      return;
    }
  
    try {
      setUploading(true);
      const imageBlob = await uriToBlob(imageUri);
      const filename = `trainers/${Date.now()}_profile.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, imageBlob);
      const imageUrl = await getDownloadURL(storageRef);
  
      const trainerID = generateTrainerID();
  
      await addDoc(collection(db, 'trainers'), {
        trainerID,
        firstName: firstName.toUpperCase(),
        lastName: lastName.toUpperCase(),
        email,
        phone,
        specialization: speciality,
        imageUrl,
        createdAt: new Date()
      });
  
      Alert.alert("Success", "Trainer enrolled successfully.");
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setSpeciality('');
      setImageUri(null);

      navigation.navigate('Home');
  
    } catch (error) {
      console.error("Error enrolling trainer:", error);
      Alert.alert("Error", "Something went wrong during enrollment.");
    } finally {
      setUploading(false);
    }
  };  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Enroll New Trainer</Text>

      <TextInput
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        mode="outlined"
      />
      <TextInput
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
        mode="outlined"
      />
      <HelperText type="info" visible={true}>
        Must start with 0 or +256
      </HelperText>

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button mode="outlined" onPress={() => setMenuVisible(true)} style={styles.dropdown}>
            {speciality || 'Select Specialization'}
          </Button>
        }
      >
        {specializations.map(spec => (
          <Menu.Item key={spec} onPress={() => {
            setSpeciality(spec);
            setMenuVisible(false);
          }} title={spec} />
        ))}
      </Menu>

      <Button icon="camera" mode="outlined" onPress={handleImagePick} style={styles.input}>
        Choose Profile Image
      </Button>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={uploading}
        disabled={uploading}
        style={styles.submitButton}
      >
        Enroll Trainer
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 16,
    color: '#FF6F00',
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  dropdown: {
    marginBottom: 12,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#FF6F00',
  },
});

export default EnrollTrainerScreen;
