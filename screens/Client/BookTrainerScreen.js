import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, ActivityIndicator, Avatar } from 'react-native-paper';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';

const BookTrainerScreen = ({ route, navigation }) => {
  const { trainerId, trainerName, trainerData } = route.params || {};
  const [availability, setAvailability] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sessions');
  const clientId = auth.currentUser?.uid;

  useEffect(() => {
    if (!clientId) {
      handleUnauthenticated();
      return;
    }

    if (!trainerId) {
      Alert.alert('Error', 'No trainer selected');
      navigation.goBack();
      return;
    }

    fetchData();
  }, [trainerId, clientId, navigation]);

  const handleUnauthenticated = () => {
    Alert.alert('Error', 'You must be logged in to book an appointment.', [
      {
        text: 'OK',
        onPress: () => navigation.replace('Login', {
          role: 'client',
          redirectTo: 'BookTrainer',
          params: route.params
        })
      }
    ]);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch group sessions
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('trainerID', '==', trainerId)
      );
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessionsData = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSessions(sessionsData);

      // Fetch one-to-one availability
      const availabilityQuery = query(
        collection(db, 'trainer_availability'),
        where('trainerId', '==', trainerId),
        where('available', '==', true)
      );
      const unsubscribe = onSnapshot(
        availabilityQuery,
        (snapshot) => {
          const availabilityData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setAvailability(availabilityData);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching availability:', error);
          Alert.alert('Error', 'Failed to load availability.');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const requestAppointment = async (slot) => {
    try {
      const appointmentRequestsRef = collection(db, 'appointment_requests');
      
      const appointmentData = {
        trainerId,
        trainerName,
        clientId,
        clientName: auth.currentUser?.displayName || 'Client',
        status: 'pending',
        type: activeTab === 'sessions' ? 'group' : 'private',
        createdAt: serverTimestamp()
      };

      if (activeTab === 'sessions') {
        // Group session data
        appointmentData.sessionId = slot.id;
        appointmentData.sessionName = slot.name;
        appointmentData.day = slot.schedule; // Using schedule as day
        appointmentData.requestedTime = {
          start: slot.startTime,
          end: slot.endTime
        };
        appointmentData.slots = slot.slots;
        appointmentData.currentParticipants = slot.currentParticipants || 0;
      } else {
        // Private session data
        appointmentData.availabilityId = slot.id;
        appointmentData.day = slot.day;
        appointmentData.requestedTime = {
          start: slot.startTime,
          end: slot.endTime
        };
        appointmentData.notes = slot.notes || '';
      }

      const requestRef = await addDoc(appointmentRequestsRef, appointmentData);

      navigation.navigate('BookingConfirmation', {
        requestId: requestRef.id,
        trainerId,
        trainerName,
        sessionDetails: {
          type: activeTab === 'sessions' ? 'group' : 'private',
          name: activeTab === 'sessions' ? slot.name : 'Private Training',
          day: activeTab === 'sessions' ? slot.schedule : slot.day,
          time: `${slot.startTime} - ${slot.endTime}`,
          ...(activeTab === 'sessions' && {
            slots: slot.slots,
            currentParticipants: slot.currentParticipants || 0
          })
        },
        clientId
      });

    } catch (err) {
      console.error('Error sending request:', err);
      Alert.alert('Error', 'Could not send request. Please try again.');
    }
  };

  const renderSessionCard = (session) => (
    <Card key={session.id} style={styles.card} mode="elevated">
      <Card.Cover source={{ uri: session.imageUrl || 'https://via.placeholder.com/300' }} />
      <Card.Content style={styles.cardContent}>
        <Text variant="titleLarge" style={styles.cardTitle}>{session.name}</Text>
        <View style={styles.sessionMeta}>
          <Text variant="bodyMedium">
            <MaterialIcons name="people" size={16} /> {session.currentParticipants || 0}/{session.slots} slots
          </Text>
          <Text variant="bodyMedium">
            <MaterialIcons name="schedule" size={16} /> {session.startTime} - {session.endTime}
          </Text>
          <Text variant="bodyMedium">
            <MaterialIcons name="calendar-today" size={16} /> Every {session.schedule}
          </Text>
        </View>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button 
          mode="contained" 
          onPress={() => requestAppointment(session)}
          style={styles.requestButton}
          disabled={session.slots <= (session.currentParticipants || 0)}
        >
          {session.slots <= (session.currentParticipants || 0) ? 'Full' : 'Join Session'}
        </Button>
      </Card.Actions>
    </Card>
  );

  const renderOneToOneSlot = (slot) => (
    <Card key={slot.id} style={styles.card} mode="elevated">
      <Card.Content>
        <Text variant="titleLarge" style={styles.cardTitle}>{slot.day}</Text>
        <Text variant="bodyMedium" style={styles.timeSlot}>
          <MaterialIcons name="schedule" size={16} /> {slot.startTime} - {slot.endTime}
        </Text>
        {slot.notes && <Text variant="bodySmall" style={styles.notes}>{slot.notes}</Text>}
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => requestAppointment(slot)}
          style={styles.requestButton}
        >
          Book Private Session
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image
          size={80}
          source={{ uri: trainerData?.imageUrl || 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />
        <Text variant="headlineMedium" style={styles.heading}>
          {trainerName}
        </Text>
        <Text variant="bodyMedium" style={styles.specialization}>
          {trainerData?.specialization || 'Fitness Trainer'}
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <Button
          mode={activeTab === 'sessions' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('sessions')}
          style={styles.tabButton}
          buttonColor={activeTab === 'sessions' ? '#F7941D' : undefined} 
          textColor={activeTab === 'sessions' ? 'white' : '#F7941D'}
        >
          Group Sessions
        </Button>
        <Button
          mode={activeTab === 'oneToOne' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('oneToOne')}
          style={styles.tabButton}
          buttonColor={activeTab === 'oneToOne' ? '#F7941D' : undefined}
          textColor={activeTab === 'oneToOne' ? 'white' : '#F7941D'}
        >
          1-on-1 Training
        </Button>
      </View>

      {activeTab === 'sessions' ? (
        <>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Available Group Sessions
          </Text>
          {sessions.length === 0 ? (
            <Text style={styles.noSlots}>No group sessions available.</Text>
          ) : (
            sessions.map(renderSessionCard)
          )}
        </>
      ) : (
        <>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Private Session Slots
          </Text>
          {availability.length === 0 ? (
            <Text style={styles.noSlots}>No private slots available.</Text>
          ) : (
            availability.map(renderOneToOneSlot)
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 20
  },
  avatar: {
    marginBottom: 10,
    backgroundColor: '#F7941D'
  },
  heading: {
    marginBottom: 4,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333'
  },
  specialization: {
    color: '#666',
    marginBottom: 16,
    textAlign: 'center'
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10
  },
  tabButton: {
    flex: 1,
    borderColor: '#F7941D'
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  noSlots: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#666',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8
  },
  card: {
    marginBottom: 16,
    backgroundColor: 'white',
    overflow: 'hidden',
    borderColor: '#F7941D',
    borderWidth: 1
  },
  cardContent: {
    paddingTop: 12
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  sessionMeta: {
    marginTop: 8,
    gap: 4
  },
  timeSlot: {
    marginVertical: 4,
    color: '#555'
  },
  notes: {
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingTop: 0
  },
  requestButton: {
    marginHorizontal: 8,
    marginBottom: 8,
    backgroundColor: '#F7941D'
  }
});

export default BookTrainerScreen;