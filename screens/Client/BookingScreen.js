import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

const BookAppointmentScreen = ({ route, navigation }) => {
  const { sessionId, trainerId, clientId } = route.params;
  const [loading, setLoading] = useState(false);

  const bookAppointment = async () => {
    setLoading(true);
    try {
      // 1. Fetch session
      const sessionRef = doc(db, 'sessions', sessionId);
      const sessionSnap = await getDoc(sessionRef);

      if (!sessionSnap.exists()) {
        Alert.alert('Session not found');
        setLoading(false);
        return;
      }

      const sessionData = sessionSnap.data();

      // 2. Check available slots
      if (sessionData.availableSlots <= 0) {
        Alert.alert('Session Full', 'No available slots for this session.');
        setLoading(false);
        return;
      }

      // 3. Create appointment
      await addDoc(collection(db, 'appointments'), {
        clientId,
        trainerId,
        sessionId,
        date: new Date().toISOString(),
        status: 'pending'
      });

      // 4. Decrease available slots
      await updateDoc(sessionRef, {
        availableSlots: sessionData.availableSlots - 1
      });

      Alert.alert('Success', 'Appointment booked successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Session</Text>
      <Button
        title={loading ? "Booking..." : "Book Appointment"}
        onPress={bookAppointment}
        disabled={loading}
        color="#FFA726"
      />
    </View>
  );
};

export default BookAppointmentScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center'
  }
});
