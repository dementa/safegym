import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig';
import { Card, Button, ActivityIndicator } from 'react-native-paper';

const BookAppointmentScreen = ({ route, navigation }) => {
  const { sessionId, trainerId, clientId, requestId, trainerName } = route.params;
  const [loading, setLoading] = useState(false);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [slotsAvailable, setSlotsAvailable] = useState(0);

  // Check if user is authenticated
  if (!auth.currentUser || auth.currentUser.uid !== clientId) {
    Alert.alert('Error', 'You must be logged in to book an appointment.', [
      { text: 'OK', onPress: () => navigation.navigate('BookAppointmentScreen') }
    ]);
    return null;
  }

  // Fetch session details when component mounts
  React.useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const sessionRef = doc(db, 'trainer_availability', sessionId);
        const sessionSnap = await getDoc(sessionRef);
        
        if (sessionSnap.exists()) {
          setSessionDetails(sessionSnap.data());
          setSlotsAvailable(sessionSnap.data().availableSlots);
        }
      } catch (error) {
        console.error("Error fetching session details:", error);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

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
        available: sessionData.availableSlots - 1 > 0
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
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Image 
          source={require('../../assets/images/logo2.png')} 
          style={styles.logo} 
        />
        <Text style={styles.headerTitle}>Confirm Appointment</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.trainerName}>With {trainerName}</Text>
          
          {sessionDetails && (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Day:</Text>
                <Text style={styles.detailValue}>{sessionDetails.day}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time:</Text>
                <Text style={styles.detailValue}>
                  {sessionDetails.startTime} - {sessionDetails.endTime}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Slots Available:</Text>
                <Text style={[
                  styles.detailValue,
                  slotsAvailable <= 0 ? styles.slotWarning : styles.slotSuccess
                ]}>
                  {slotsAvailable}
                </Text>
              </View>
            </>
          )}

          <View style={styles.slotIndicatorContainer}>
            {slotsAvailable <= 0 ? (
              <Text style={styles.slotWarningText}>No slots available for this session</Text>
            ) : (
              <Text style={styles.slotSuccessText}>Slots available! Book now</Text>
            )}
          </View>
        </Card.Content>
      </Card>

      <TouchableOpacity
        style={[
          styles.bookButton,
          slotsAvailable <= 0 && styles.disabledButton
        ]}
        onPress={bookAppointment}
        disabled={loading || slotsAvailable <= 0}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {slotsAvailable <= 0 ? 'Session Full' : 'Confirm Appointment'}
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Book Appointment with {trainerName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  logo: {
    width: 80,
    height: 40,
    resizeMode: 'contain'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 24,
    elevation: 3
  },
  trainerName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFA726',
    textAlign: 'center'
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600'
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  slotSuccess: {
    color: '#4CAF50'
  },
  slotWarning: {
    color: '#F44336'
  },
  slotIndicatorContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    alignItems: 'center'
  },
  slotSuccessText: {
    color: '#4CAF50',
    fontWeight: 'bold'
  },
  slotWarningText: {
    color: '#F44336',
    fontWeight: 'bold'
  },
  bookButton: {
    backgroundColor: '#FFA726',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2
  },
  disabledButton: {
    backgroundColor: '#cccccc'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  footerText: {
    marginTop: 24,
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic'
  }
});

export default BookAppointmentScreen;