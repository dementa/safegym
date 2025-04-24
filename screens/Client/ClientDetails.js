import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { db } from '../../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Feather } from '@expo/vector-icons';

const ClientDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { client } = route.params;

  const [sessions, setSessions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // Fetch sessions booked by client
        const sessionsQuery = query(collection(db, 'sessions'), where('clients', 'array-contains', client.id));
        const sessionSnap = await getDocs(sessionsQuery);
        setSessions(sessionSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        // Fetch confirmed appointments
        const appointQuery = query(collection(db, 'appointments'), where('clientId', '==', client.id));
        const appointSnap = await getDocs(appointQuery);
        setAppointments(appointSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        // Fetch appointment requests
        const requestQuery = query(collection(db, 'appointment_requests'), where('clientId', '==', client.id));
        const requestSnap = await getDocs(requestQuery);
        setRequests(requestSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    fetchClientData();
  }, [client.id]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: client.profilePicture }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{client.fullName}</Text>
          <Text>Email: {client.email}</Text>
          <Text>Phone: {client.phone}</Text>
          <View style={styles.icons}>
            <Feather name="mail" size={20} />
            <Feather name="message-circle" size={20} />
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Joined Sessions</Text>
      <FlatList
        horizontal
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.sessionCard}>
            <Image source={{ uri: item.image }} style={styles.sessionImage} />
            <Text style={styles.sessionTitle}>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No sessions joined yet.</Text>}
      />

      <Text style={styles.sectionTitle}>Confirmed Appointments</Text>
      <FlatList
        horizontal
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointmentCard}>
            <Text style={styles.appointmentTitle}>Trainer ID: {item.trainerId}</Text>
            <Text style={styles.appointmentInfo}>Date: {item.day || item.date}</Text>
            <Text style={styles.appointmentInfo}>
              Time: {item.time?.start} - {item.time?.end}
            </Text>
            <Text style={styles.appointmentInfo}>Status: {item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No confirmed appointments.</Text>}
      />

      <Text style={styles.sectionTitle}>Pending Requests</Text>
      <FlatList
        horizontal
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointmentCard}>
            <Text style={styles.appointmentTitle}>Trainer ID: {item.trainerId}</Text>
            <Text style={styles.appointmentInfo}>Date: {item.day}</Text>
            <Text style={styles.appointmentInfo}>
              Time: {item.requestedTime.start} - {item.requestedTime.end}
            </Text>
            <Text style={styles.appointmentInfo}>Status: {item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No pending requests.</Text>}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EditClient', { client })}
      >
        <Text style={styles.buttonText}>Edit Client Info</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  info: {
    marginLeft: 12,
    flex: 1
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  icons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10
  },
  sessionCard: {
    width: 140,
    marginRight: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 10
  },
  sessionImage: {
    height: 80,
    borderRadius: 8
  },
  sessionTitle: {
    color: '#fff',
    marginTop: 6,
    fontWeight: 'bold'
  },
  appointmentCard: {
    width: 180,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
    marginRight: 10
  },
  appointmentTitle: {
    fontWeight: 'bold',
    fontSize: 14
  },
  appointmentInfo: {
    fontSize: 12,
    color: '#333'
  },
  button: {
    backgroundColor: '#FFA726',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default ClientDetails;