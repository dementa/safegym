import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, ActivityIndicator, Chip } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const clientId = 'xyz456'; // Replace with actual logged-in user UID

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('appointment_requests')
      .where('clientId', '==', clientId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(data);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  if (loading) return <ActivityIndicator animating size="large" style={{ marginTop: 32 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>
        My Appointments
      </Text>

      {bookings.length === 0 ? (
        <Text style={styles.noBookings}>No bookings yet. Start exploring trainers!</Text>
      ) : (
        bookings.map((booking) => (
          <Card key={booking.id} style={styles.card}>
            <Card.Content>
              <Text style={styles.cardText}>📅 {booking.day}</Text>
              <Text style={styles.cardText}>
                🕐 {booking.requestedTime.start} - {booking.requestedTime.end}
              </Text>
              <Text style={styles.cardText}>💪 Trainer ID: {booking.trainerId}</Text>
              <Chip
                style={[
                  styles.chip,
                  booking.status === 'booked'
                    ? styles.booked
                    : booking.status === 'rejected'
                    ? styles.rejected
                    : styles.pending,
                ]}
                textStyle={{ color: 'white' }}
              >
                {booking.status.toUpperCase()}
              </Chip>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { marginBottom: 16 },
  noBookings: { textAlign: 'center', marginTop: 32, fontSize: 16 },
  card: { marginBottom: 12 },
  cardText: { marginBottom: 4 },
  chip: { marginTop: 8, alignSelf: 'flex-start' },
  booked: { backgroundColor: '#4CAF50' },
  pending: { backgroundColor: '#FFC107' },
  rejected: { backgroundColor: '#F44336' },
});

export default MyBookingsScreen;
