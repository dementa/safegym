import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Avatar, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SessionDetailsScreen = ({ route }) => {
  const { session } = route.params;
  const navigation = useNavigation();

  const moreSessions = [
    {
      id: '1',
      name: 'Aerobics',
      imageUrl: session.imageUrl,
      time: session.startTime,
      schedule: session.schedule,
      slots: session.slots,
    },
    {
      id: '2',
      name: 'Gymnastics',
      imageUrl: session.imageUrl,
      time: '10:00 AM',
      schedule: 'Every Tuesday',
      slots: '10',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <Image source={{ uri: session.imageUrl }} style={styles.bannerImage} />

      {/* Title & Coach */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sessionTitle}>{session.name}</Text>
        <View style={styles.coachRow}>
          <Avatar.Image size={36} source={{ uri: session.trainerImage }} />
          <Text style={styles.coachName}>Session By {session.trainerName}</Text>
        </View>

        <Text style={styles.description}>
          Lorem ipsum dolor sit amet consectetur. Euismod non libero orci duis tortor interdum.
          Ornare consectetur aliquet viverra est etiam et quis. Interdum
        </Text>

        {/* Schedule Info */}
        <View style={styles.scheduleRow}>
          <View style={styles.scheduleItem}>
            <Icon name="alarm" size={20} />
            <Text style={styles.scheduleText}>{session.startTime}</Text>
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
          onPress={() => navigation.navigate('Register')}
        >
          Book Appointment
        </Button>

        {/* More from this Coach */}
        <Text style={styles.moreTitle}>More from {session.trainerName}</Text>
        <FlatList
          horizontal
          data={moreSessions}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Cover source={{ uri: item.imageUrl }} />
              <Card.Content style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSub}>
                  <Icon name="alarm" size={16} /> {item.time}   <Icon name="calendar" size={16} /> {item.schedule}
                </Text>
                <Text style={styles.cardSlots}>{item.slots} Slots</Text>
              </Card.Content>
            </Card>
          )}
        />
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
  cardContent: { paddingTop: 8 },
  cardTitle: { fontWeight: 'bold', fontSize: 16 },
  cardSub: { fontSize: 12, color: '#777', marginTop: 6 },
  cardSlots: { fontSize: 12, color: '#F8981D', marginTop: 4 }
});

export default SessionDetailsScreen;
