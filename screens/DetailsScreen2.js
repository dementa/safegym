import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Avatar, Button, Card } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const SessionDetailsScreen = () => {
  const route = useRoute();
  const { session } = route.params;
  const navigation = useNavigation();

  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedSessions, setRelatedSessions] = useState([]);

  // Capitalize function for sentence case
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    const fetchTrainerAndSessions = async () => {
      try {
        const q = query(
          collection(db, 'trainers'),
          where('trainerID', '==', session.trainerID)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const trainerData = querySnapshot.docs[0].data();
          setTrainer(trainerData);

          // Fetch other sessions by this trainer
          const sessionsRef = collection(db, 'sessions');
          const sessionsQuery = query(
            sessionsRef,
            where('trainerID', '==', session.trainerID)
          );
          const sessionsSnapshot = await getDocs(sessionsQuery);

          const otherSessions = [];
          sessionsSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.name !== session.name) {
              otherSessions.push(data);
            }
          });
          setRelatedSessions(otherSessions);
        } else {
          console.warn('No trainer found with trainerID:', session.trainerID);
        }
      } catch (error) {
        console.error('Error fetching trainer and sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerAndSessions();
  }, [session.trainerID]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F8981D" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <Image source={{ uri: session.imageUrl }} style={styles.bannerImage} />

      {/* Session Info */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sessionTitle}>{session.name}</Text>

        {/* Trainer Info */}
        {trainer && (
          <View style={styles.coachRow}>
            <Avatar.Image size={36} source={{ uri: trainer.imageUrl }} />
            <Text style={styles.coachName}>
              Session By {capitalize(trainer.firstName)} {capitalize(trainer.lastName)}
            </Text>
          </View>
        )}

        {/* Description */}
        <Text style={styles.description}>{session.description}</Text>

        {/* Schedule Info */}
        <View style={styles.scheduleRow}>
          <View style={styles.scheduleItem}>
            <Icon name="clock-outline" size={20} />
            <Text style={styles.scheduleText}>
              {session.startTime} - {session.endTime}
            </Text>
          </View>
          <View style={styles.scheduleItem}>
            <Icon name="calendar" size={20} />
            <Text style={styles.scheduleText}>{session.schedule}</Text>
          </View>
        </View>

        {/* Book Button */}
        <Button
          mode="contained"
          buttonColor="#F8981D"
          textColor="#fff"
          style={styles.bookButton}
          onPress={() => navigation.navigate('RoleSelection')}
        >
          Book Appointment
        </Button>

        {/* More from Coach */}
        <Text style={styles.moreTitle}>
          More from {capitalize(trainer?.firstName)}
        </Text>

        {relatedSessions.length > 0 ? (
          <FlatList
            horizontal
            data={relatedSessions}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <Card
                style={styles.card}
                onPress={() => navigation.push('SessionDetails', { session: item })}
              >
                <Card.Cover source={{ uri: item.imageUrl }} />
                <Card.Content>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSub}>
                    {item.startTime} - {item.endTime}
                  </Text>
                  <Text style={styles.cardSub}>{item.schedule}</Text>
                  <Text style={styles.cardSlots}>{item.slots} Slots</Text>
                </Card.Content>
              </Card>
            )}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.cardSub}>
            No other sessions from this coach.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  bannerImage: { width: '100%', height: 200 },
  detailsContainer: { padding: 16 },
  sessionTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  coachRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  coachName: { fontSize: 16, fontWeight: '500' },
  description: { color: '#444', lineHeight: 20, marginBottom: 20 },
  scheduleRow: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  scheduleItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scheduleText: { fontSize: 16 },
  bookButton: { marginBottom: 30, borderRadius: 6, paddingVertical: 6 },
  moreTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  card: { width: 180, marginRight: 12 },
  cardTitle: { fontWeight: 'bold', fontSize: 16 },
  cardSub: { fontSize: 12, color: '#777' },
  cardSlots: { fontSize: 12, color: '#F8981D', marginTop: 4 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
});

export default SessionDetailsScreen;
