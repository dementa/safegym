import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Avatar } from 'react-native-paper';

const TrainerDetails = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  
  if (!route.params?.trainer) {
    Alert.alert('Error', 'No trainer data available');
    navigation.goBack();
    return null;
  }

  const { trainer } = route.params;

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const q = query(
          collection(db, 'sessions'), 
          where('trainerID', '==', trainer.trainerID || trainer.id)
        );
        const querySnapshot = await getDocs(q);
        const sessionList = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        setSessions(sessionList);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        Alert.alert("Error", "Could not load sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [trainer]);

  const handleSchedulePress = () => {
    if (!trainer?.trainerID && !trainer?.id) {
      Alert.alert('Error', 'Trainer information is incomplete');
      return;
    }

    navigation.navigate('BookTrainer', { 
      trainerId: trainer.trainerID || trainer.id,
      trainerName: `${trainer.firstName} ${trainer.lastName || ''}`.trim(),
      trainerData: trainer
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Image source={require('../../assets/images/logo2.png')} style={styles.logo} />
        <Avatar.Icon size={36} icon="account" />
      </View>

      <View style={styles.card}>
        <Image 
          source={{ uri: trainer.imageUrl || 'https://via.placeholder.com/150' }} 
          style={styles.avatar} 
        />
        <View style={styles.info}>
          <Text style={styles.name}>Coach {trainer.firstName?.toLowerCase()}</Text>
          <Text style={styles.infoText}>Email: {trainer.email || 'Not provided'}</Text>
          <Text style={styles.infoText}>Contact: {trainer.phone || 'Not provided'}</Text>
          <Text style={styles.infoText}>Availability: {trainer.availability || 'Not specified'}</Text>
          <View style={styles.icons}>
            <MaterialIcons name="call" size={20} />
            <Feather name="mail" size={20} />
            <Feather name="message-square" size={20} />
          </View>
        </View>
      </View>

      <Text style={styles.bioTitle}>Bio</Text>
      <Text style={styles.bioText}>{trainer.bio || 'No bio available'}</Text>

      <Text style={styles.sectionTitle}>Sessions</Text>
      {sessions.length > 0 ? (
        <FlatList
          data={sessions}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.sessionCard}
              onPress={() => navigation.navigate('Details', { session: item })}
            >
              <Image 
                source={{ uri: item.imageUrl || 'https://via.placeholder.com/250' }} 
                style={styles.sessionImage} 
              />
              <Text style={styles.sessionTitle}>{item.name}</Text>
              <Text style={styles.sessionMeta}>{item.slots} Slots</Text>
              <Text style={styles.sessionMeta}>
                {`${item.startTime} - ${item.endTime} | Every ${item.schedule}`}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noSessions}>No sessions available from this trainer</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSchedulePress}
      >
        <Text style={styles.buttonText}>Schedule Appointment with trainer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    gap: 24,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 12,
    gap: 16,
    borderRadius: 12,
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
  infoText: {
    color: '#888'
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
  bioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20
  },
  bioText: {
    marginVertical: 8,
    color: '#666'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20
  },
  sessionCard: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginRight: 12,
    width: 250
  },
  sessionImage: {
    height: 150,
    borderRadius: 10,
    marginBottom: 6
  },
  sessionTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold'
  },
  sessionMeta: {
    color: '#ccc',
    fontSize: 12
  },
  button: {
    backgroundColor: '#FFA726',
    padding: 12,
    borderRadius: 10,
    marginTop: 24,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  topBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  logo: { 
    width: 80, 
    height: 40, 
    resizeMode: 'contain' 
  },
  noSessions: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20
  }
});

export default TrainerDetails;