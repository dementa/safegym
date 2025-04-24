import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

const AdminDashboardScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubTrainers = onSnapshot(collection(db, 'trainers'), (snapshot) => {
      setTrainers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubSessions = onSnapshot(collection(db, 'sessions'), (snapshot) => {
      setSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubAppointments = onSnapshot(collection(db, 'appointments'), (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubUsers();
      unsubTrainers();
      unsubSessions();
      unsubAppointments();
    };
  }, []);

  const getApproved = (data) => data.filter(item => item.approved === 'approved').length;
  const getPending = (data) => data.filter(item => item.approved !== 'approved').length;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <View style={styles.statsContainer}>
        <StatCard label="Users" value={users.length} />
        <StatCard label="Trainers" value={trainers.length} />
        <StatCard label="Sessions" value={sessions.length} />
        <StatCard label="Approved Sessions" value={getApproved(sessions)} />
        <StatCard label="Pending Sessions" value={getPending(sessions)} />
        <StatCard label="Approved Appointments" value={getApproved(appointments)} />
        <StatCard label="Pending Appointments" value={getPending(appointments)} />
      </View>

      <Text style={styles.subtitle}>Quick Actions</Text>

      <View style={styles.buttonGroup}>
        <ActionButton label="Manage Users" onPress={() => navigation.navigate('ManageUsers')} />
        <ActionButton label="Manage Trainers" onPress={() => navigation.navigate('ManageTrainers')} />
        <ActionButton label="Manage Sessions" onPress={() => navigation.navigate('ManageSessions')} />
      </View>
    </ScrollView>
  );
};

const StatCard = ({ label, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ActionButton = ({ label, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <MaterialIcons name="arrow-forward-ios" size={20} color="#fff" />
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFE0B2',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
    marginVertical: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
  },
  buttonGroup: {
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7941D',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AdminDashboardScreen;
