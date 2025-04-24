import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, ActivityIndicator } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const trainerId = 'abc123'; // Replace with actual trainer UID

const ReviewRequestsScreen = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('appointment_requests')
      .where('trainerId', '==', trainerId)
      .where('status', '==', 'pending')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(data);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (request, status) => {
    try {
      const batch = firestore().batch();
      const requestRef = firestore().collection('appointment_requests').doc(request.id);
      batch.update(requestRef, { status });

      if (status === 'booked') {
        const availabilityRef = firestore().collection('trainer_availability').doc(request.availabilityId);
        batch.update(availabilityRef, { available: false });
      }

      await batch.commit();
      Alert.alert('Success', `Request ${status === 'booked' ? 'approved' : 'rejected'}.`);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not update request.');
    }
  };

  if (loading) return <ActivityIndicator animating size="large" style={{ marginTop: 32 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>
        Appointment Requests
      </Text>

      {requests.length === 0 ? (
        <Text style={styles.noRequests}>No pending requests right now.</Text>
      ) : (
        requests.map((req) => (
          <Card key={req.id} style={styles.card}>
            <Card.Content>
              <Text style={styles.cardText}>
                📅 {req.day} — {req.requestedTime.start} to {req.requestedTime.end}
              </Text>
              <Text style={styles.cardText}>👤 Client ID: {req.clientId}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => handleUpdateStatus(req, 'booked')}>Approve</Button>
              <Button onPress={() => handleUpdateStatus(req, 'rejected')} textColor="red">
                Reject
              </Button>
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
  noRequests: { textAlign: 'center', marginTop: 32, fontSize: 16 },
  card: { marginBottom: 12 },
  cardText: { marginBottom: 4 },
});

export default ReviewRequestsScreen;
