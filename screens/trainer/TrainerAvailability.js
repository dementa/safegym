import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, TextInput, Menu } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { format } from 'date-fns';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const TrainerAvailabilityScreen = ({ route }) => {
  const { trainerID } = route.params;

  const [selectedDay, setSelectedDay] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSave = async () => {
    if (!selectedDay) {
      Alert.alert("Missing", "Please select a day.");
      return;
    }

    if (startTime >= endTime) {
      Alert.alert("Invalid Time Range", "Start time must be before end time.");
      return;
    }

    try {
      const availability = {
        day: selectedDay,
        startTime: format(startTime, 'HH:mm'),
        endTime: format(endTime, 'HH:mm'),
      };

      const trainerRef = doc(collection(db, 'trainers'), trainerID);
      await updateDoc(trainerRef, {
        availability: arrayUnion(availability),
      });

      Alert.alert("Success", "Availability saved successfully.");
      setSelectedDay('');
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save availability.");
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Set Your Availability</Text>

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button mode="outlined" onPress={() => setMenuVisible(true)}>
            {selectedDay || 'Pick a Day'}
          </Button>
        }
      >
        {daysOfWeek.map(day => (
          <Menu.Item
            key={day}
            onPress={() => {
              setSelectedDay(day);
              setMenuVisible(false);
            }}
            title={day}
          />
        ))}
      </Menu>

      <Button mode="outlined" onPress={() => setShowStartPicker(true)}>
        Select Start Time: {format(startTime, 'hh:mm a')}
      </Button>
      {showStartPicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={(e, selected) => {
            setShowStartPicker(false);
            if (selected) setStartTime(selected);
          }}
        />
      )}

      <Button mode="outlined" onPress={() => setShowEndPicker(true)}>
        Select End Time: {format(endTime, 'hh:mm a')}
      </Button>
      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={(e, selected) => {
            setShowEndPicker(false);
            if (selected) setEndTime(selected);
          }}
        />
      )}

      <Button mode="contained" style={styles.saveBtn} onPress={handleSave}>
        Save Availability
      </Button>
    </View>
  );
};

export default TrainerAvailabilityScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
    gap: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center'
  },
  saveBtn: {
    marginTop: 24,
    backgroundColor: '#FF6F00'
  }
});
