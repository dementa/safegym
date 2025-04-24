import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig';

const BookAppointmentScreen = ({ route, navigation }) => {
  const { sessionId, trainerId, clientId, requestId } = route.params;
  const [loading, setLoading] = useState(false);

  // Check if user is authenticated
  if (!auth.currentUser || auth.currentUser.uid !== clientId) {
    Alert.alert('Error', 'You must be logged in to book an appointment.', [
      { text: 'OK', onPress: () => navigation.navigate('BookAppointmentScreen') }
    ]);
    return null;
  }

  const bookAppointment = async () => {
    setLoading(true);
    try {
      // 1. Fetch session from trainer_availability
      const sessionRef = doc(db, 'trainer_availability', sessionId);
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
        requestId,
        date: new Date().toISOString(),
        status: 'booked',
        day: sessionData.day,
        time: { start: sessionData.startTime, end: sessionData.endTime }
      });

      // 4. Update appointment_requests status
      const requestRef = doc(db, 'appointment_requests', requestId);
      await updateDoc(requestRef, { status: 'booked' });

      // 5. Decrease available slots and mark slot as booked
      await updateDoc(sessionRef, {
        availableSlots: sessionData.availableSlots - 1,
        available: false
      });

      Alert.alert('Success', 'Appointment booked successfully!');
      navigation.navigate('MyBookings');
    } catch (error) {
      console.error('Error booking appointment:', error);
      if (error.code === 'permission-denied') {
        Alert.alert('Error', 'You are not authorized to book this appointment.');
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Appointment</Text>
      <Button
        title={loading ? 'Booking...' : 'Confirm Appointment'}
        onPress={bookAppointment}
        disabled={loading}
        color="#FFA726"
      />
    </View>
  );
};

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

export default BookAppointmentScreen;