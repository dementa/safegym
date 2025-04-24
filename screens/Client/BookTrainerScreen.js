import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, ActivityIndicator } from 'react-native-paper';
import { db, firebase } from '../../firebase/firebaseConfig'; // adjust path to your firebase config

const clientId = 'xyz456'; // Replace with actual logged-in client UID

const BookTrainerScreen = ({ route, navigation }) => {
  const { trainerId, trainerName } = route.params;
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = db
      .collection('trainer_availability')
      .where('trainerId', '==', trainerId)
      .where('available', '==', true)
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAvailability(data);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching availability:", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [trainerId]);

  const requestAppointment = async (slot) => {
    try {
      await db.collection('appointment_requests').add({
        trainerId,
        clientId,
        day: slot.day,
        requestedTime: {
          start: slot.startTime,
          end: slot.endTime
        },
        availabilityId: slot.id,
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      Alert.alert('Request Sent', 'Your appointment request has been sent.');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not send request.');
    }
  };

  if (loading) return <ActivityIndicator animating size="large" style={{ marginTop: 32 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>
        Book Appointment with {trainerName}
      </Text>

      {availability.length === 0 ? (
        <Text style={styles.noSlots}>No available slots at the moment.</Text>
      ) : (
        availability.map((slot) => (
          <Card key={slot.id} style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>{slot.day}</Text>
              <Text>
                {slot.startTime} - {slot.endTime}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => requestAppointment(slot)}>Request</Button>
            </Card.Actions>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { marginBottom: 16 },
  noSlots: { textAlign: 'center', marginTop: 32, fontSize: 16 },
  card: { marginBottom: 12 },
  cardTitle: { fontWeight: 'bold', fontSize: 16 },
});

export default BookTrainerScreen;
