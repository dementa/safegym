import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  Text as RNText,
  TouchableOpacity,
} from 'react-native';
import { Text, Avatar, Button, Card, Chip } from 'react-native-paper';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const MainApp = ({ navigation, route, userID }) => {
  const { user, userRole } = route.params || {uid: "5o2z4Aj5qpPTKvd1J8gE4MEKaFY2"};
  const [sessions, setSessions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const unsubscribeSessions = onSnapshot(collection(db, 'sessions'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSessions(data);
    });

    const unsubscribeTrainers = onSnapshot(collection(db, 'trainers'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrainers(data);
    });

    let unsubscribeAppointments = null;
    if (user) {
      unsubscribeAppointments = onSnapshot(collection(db, 'appointments'), (snapshot) => {
        const userAppointments = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(appt => appt.userId === user.uid);
        setAppointments(userAppointments);
      });
    }

    return () => {
      unsubscribeSessions();
      unsubscribeTrainers();
      if (unsubscribeAppointments) unsubscribeAppointments();
    };
  }, [user]);

  return (
    <ScrollView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Image source={require('../assets/images/logo2.png')} style={styles.logo} />
        
        <Avatar.Icon size={36} icon="account" />
      </View>

          <Text variant="titleMedium" style={styles.sectionTitle}>Your Appointments</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={appointments}
            renderItem={({ item }) => (
              <Card style={styles.sessionCard} key={item.id}>
                <Card.Content>
                  <Text variant="bodyLarge">{item.sessionName}</Text>
                  <Text variant="labelMedium">On {item.date}</Text>
                </Card.Content>
              </Card>
            )}
            keyExtractor={item => item.id}
          />
      

      {/* Available Sessions */}
      <Text variant="titleMedium" style={styles.sectionTitle}>Available Sessions</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={sessions}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.id} onPress={() => navigation.navigate('Details', { session: item })}>
            <Card style={styles.sessionCard}>
              <Card.Cover source={{ uri: item.imageUrl }} />
              <Card.Content style={{ paddingVertical: 16 }}>
                <Text variant="bodyLarge" style={{ fontWeight: 'bold', fontSize: 24 }}>{item.name}</Text>
                <Text variant="labelMedium">{item.startTime} - {item.endTime} | Every {item.schedule}</Text>
                <Text variant="labelSmall">{item.slots} Slots</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Trainers */}
      <Text variant="titleMedium" style={styles.sectionTitle}>Trainers</Text>
      <View style={styles.trainersRow}>
        {trainers.map((trainer) => (
          <TouchableOpacity key={trainer.id} onPress={() => navigation.navigate('Trainer', { trainer })}>
            <View style={{ alignItems: 'center' }}>
              <Avatar.Image size={60} source={{ uri: trainer.imageUrl }} />
              <RNText style={{ marginTop: 6, fontWeight: '600' }}>{trainer.firstName}</RNText>
              <RNText style={{ fontSize: 12, color: '#888' }}>{trainer.specialization}</RNText>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text variant="labelSmall">©2025 SAFEGYM</Text>
        <Text variant="labelSmall">Located in Nakawa Opposite Total Energies</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 32, padding: 16, backgroundColor: '#fff' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { width: 80, height: 40, resizeMode: 'contain' },
  locationChip: { backgroundColor: '#eee' },
  joinBtn: { marginTop: 6, backgroundColor: '#000', width: 100},
  sectionTitle: { marginTop: 24, marginBottom: 30, fontSize: 24 },
  sessionCard: { width: 200, marginRight: 10 },
  trainersRow: { flexDirection: 'row', justifyContent: 'flex-start', gap: 48, marginVertical: 16 },
  footer: { alignItems: 'center', marginVertical: 30 },
});

export default MainApp;
