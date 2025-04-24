import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import uuid from 'react-native-uuid';

const AddUser = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) return null;
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileRef = ref(storage, `profilePictures/${uuid.v4()}`);
    await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
  };

  const handleAddUser = async () => {
    if (!fullName || !email || !phone || !role) {
      Alert.alert('Validation Error', 'Please fill out all fields.');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = '';
      if (image) imageUrl = await uploadImage(image);

      await addDoc(collection(db, 'users'), {
        fullName: fullName.toUpperCase(),
        email,
        phone,
        role,
        profilePicture: imageUrl,
        createdAt: new Date().toISOString()
      });

      Alert.alert('Success', 'User added successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding user:', error);
      Alert.alert('Error', 'Failed to add user');
    }

    setUploading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New User</Text>

      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ color: '#666' }}>Pick Profile Picture</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number (e.g. 077xxxxxxx or +256...)"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Role (e.g. user or trainer)"
        value={role}
        onChangeText={setRole}
      />

      <TouchableOpacity
        style={[styles.button, uploading && { backgroundColor: '#ccc' }]}
        onPress={handleAddUser}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? 'Uploading...' : 'Add User'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3E0',
    padding: 16
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#EF6C00'
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFB74D',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#FFF',
    color: '#EF6C00'
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFE0B2',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 16
  },
  button: {
    backgroundColor: '#FB8C00',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold'
  }
});

export default AddUser;
