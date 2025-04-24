import React, { useState } from 'react';
import { View, StyleSheet, Image, SafeAreaView } from 'react-native';
import { TextInput, Button, Text, Chip } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db, storage } from '../../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ScrollView } from 'react-native-gesture-handler';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AddSessionScreen = ({ navigation, route }) => {
  const { trainerID } = route.params;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slots, setSlots] = useState('');
  const [scheduleDay, setScheduleDay] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [timeError, setTimeError] = useState('');

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (event.type === 'set' && selectedTime) {
      setStartTime(selectedTime);
    }
  };

  const onEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (event.type === 'set' && selectedTime) {
      setEndTime(selectedTime);
    }
  };

  const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const formatTimeOnly = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSubmit = async () => {
    if (!name || !description || !slots || !scheduleDay || !startTime || !endTime) {
      alert("Please fill in all fields.");
      return;
    }

    if (startTime >= endTime) {
      setTimeError("Start time must be before end time.");
      return;
    }

    try {
      setUploading(true);
      let imageUrl = null;

      if (imageUri) {
        const blob = await uriToBlob(imageUri);
        const filename = `sessions/${Date.now()}.jpg`;
        const storageRef = ref(storage, filename);

        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Create session in Firestore, but set approved to false initially
      await addDoc(collection(db, 'sessions'), {
        name,
        description,
        startTime: formatTimeOnly(startTime),
        endTime: formatTimeOnly(endTime),
        schedule: scheduleDay,
        slots: parseInt(slots),
        trainerID,
        imageUrl,
        approved: 'pending', // Set to false by default
        createdAt: new Date(),
      });

      alert("Session created successfully! Waiting for approval.");
      navigation.goBack();
    } catch (err) {
      console.error("Error creating session:", err);
      alert("Something went wrong while creating the session.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Add New Session</Text>

      <TextInput
        label="Session Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Session Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Button
        mode="outlined"
        onPress={() => setShowStartTimePicker(true)}
        style={styles.button}
      >
        Start Time: {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
      </Button>

      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onStartTimeChange}
        />
      )}

      <Button
        mode="outlined"
        onPress={() => setShowEndTimePicker(true)}
        style={styles.button}
      >
        End Time: {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
      </Button>

      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onEndTimeChange}
        />
      )}

      {timeError && <Text style={styles.error}>{timeError}</Text>}

      <Text variant="labelLarge" style={styles.label}>Pick Day</Text>
      <View style={styles.dayContainer}>
        {days.map(day => (
          <Chip
            key={day}
            selected={scheduleDay === day}
            onPress={() => setScheduleDay(day)}
            style={styles.chip}
          >
            {day}
          </Chip>
        ))}
      </View>

      <TextInput
        label="Available Slots"
        value={slots}
        onChangeText={setSlots}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <Button
        icon="image"
        mode="outlined"
        onPress={handleImagePick}
        style={styles.button}
      >
        Choose Image
      </Button>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={uploading}
        disabled={uploading}
        style={styles.submitButton}
      >
        Save Session
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 20, padding: 16, backgroundColor: '#fff', flex: 1 },
  title: { marginBottom: 16, color: '#FF6F00', textAlign: 'center' },
  input: { marginBottom: 12 },
  button: { marginBottom: 12, borderColor: '#FF6F00' },
  submitButton: { marginBottom: 130, backgroundColor: '#FF6F00' },
  image: { height: 300, borderRadius: 8, marginTop: 10 },
  label: { marginTop: 12 },
  dayContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    margin: 4,
    backgroundColor: '#e0e0e0',
  },
  error: { color: 'red', marginTop: 8, textAlign: 'center' },
});

export default AddSessionScreen;
