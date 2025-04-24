import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { db } from '../../firebase/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { sessionManager } from '../../utils/resourceManager';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const approvalStatuses = ['Approved', 'Pending', 'Disapproved'];

const TrainerDashboardScreen = ({ trainerID, navigation }) => {
  trainerID = 'YHWO7200NK'; // Hardcoded for now

  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [totalSessions, setTotalSessions] = useState(0);
  const [approvedAppointments, setApprovedAppointments] = useState(0);

  // Fetch sessions
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'sessions'), (snapshot) => {
      const sessionsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSessions(sessionsList);
      setTotalSessions(sessionsList.length);
      setApprovedAppointments(sessionsList.filter(session => session.approved === 'approved').length);
    });

    return () => unsubscribe();
  }, []);

  // Apply filters when filter inputs or sessions change
  useEffect(() => {
    setFilteredSessions(applyFilters(sessions));
  }, [searchText, selectedDay, selectedStatus, sessions]);

  const applyFilters = (data) => {
    let filtered = [...data];

    if (searchText) {
      filtered = filtered.filter(session =>
        session.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        session.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedDay) {
      filtered = filtered.filter(session => session.schedule === selectedDay);
    }

    if (selectedStatus) {
      if (selectedStatus === 'Approved') {
        filtered = filtered.filter(session => session.approved === 'approved');
      } else if (selectedStatus === 'Pending') {
        filtered = filtered.filter(session => session.approved !== 'approved');
      } else if (selectedStatus === 'Disapproved') {
        filtered = filtered.filter(session => session.approved === 'disapproved');
      }
    }

    return filtered;
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedDay('');
    setSelectedStatus('');
  };

  const handleDeleteSession = (sessionId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await sessionManager.deleteResource(sessionId);
              console.log("Session deleted successfully.");
            } catch (error) {
              console.error("Error deleting session:", error);
            }
          }
        }
      ]
    );
  };

  const handleProfileClick = () => {
    navigation.navigate('TrainerProfile');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trainer Dashboard</Text>
        <TouchableOpacity onPress={handleProfileClick} style={styles.profileIcon}>
          <MaterialIcons name="account-circle" size={40} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalSessions}</Text>
          <Text style={styles.statLabel}>Total Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{approvedAppointments}</Text>
          <Text style={styles.statLabel}>Approved Sessions</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 16 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddSession', { trainerID })}
          style={styles.addButton}
        >
          <MaterialIcons name="add" size={28} color="#F7941D" />
          <Text style={styles.addButtonText}>Add Session</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('SetAvailability', { trainerID })}
          style={styles.addButton}
        >
          <MaterialIcons name="schedule" size={28} color="#F7941D" />
          <Text style={styles.addButtonText}>Set Availability</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search Sessions..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Day</Text>
        <View style={styles.dayContainer}>
          {days.map(day => (
            <Chip
              key={day}
              selected={selectedDay === day}
              onPress={() => setSelectedDay(day === selectedDay ? '' : day)}
              style={styles.chip}
            >
              {day}
            </Chip>
          ))}
        </View>

        <Text style={styles.filterLabel}>Filter by Approval Status</Text>
        <View style={styles.statusContainer}>
          {approvalStatuses.map(status => (
            <Chip
              key={status}
              selected={selectedStatus === status}
              onPress={() => setSelectedStatus(status === selectedStatus ? '' : status)}
              style={styles.chip}
            >
              {status}
            </Chip>
          ))}
        </View>

        <TouchableOpacity onPress={clearFilters} style={{ padding: 10, backgroundColor: '#F7941D', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Clear Filters</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 100 }}>
        {filteredSessions.map((item) => (
          <View key={item.id} style={styles.sessionCard}>
            <Image
              source={{ uri: item.imageUrl || 'https://via.placeholder.com/100' }}
              style={styles.sessionImage}
            />
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionName}>{item.name}</Text>
              <Text style={styles.sessionDescription}>{item.description}</Text>
              <Text style={styles.sessionTime}>{item.startTime} - {item.endTime}</Text>
              <Text style={styles.sessionDay}>Day: {item.schedule}</Text>
              <Text style={styles.sessionApproval}>Status: {item.approved}</Text>
              <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('SessionDetails', { sessionId: item.id })}>
                  <MaterialIcons name="visibility" size={24} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('EditSession', { sessionId: item.id })}>
                  <MaterialIcons name="edit" size={24} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteSession(item.id)}>
                  <MaterialIcons name="delete" size={24} color="#f44336" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    height: 80,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  profileIcon: {
    padding: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 16,
  },
  statCard: {
    padding: 14,
    backgroundColor: '#FF6F00',
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    margin: 8,
  },
  statValue: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  searchInput: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  dayContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    margin: 4,
    backgroundColor: '#FFE0B2',
  },
  sessionCard: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#FFF8F0',
    borderRadius: 10,
  },
  sessionImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#ddd',
  },
  sessionInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  sessionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  sessionDescription: {
    marginTop: 4,
    color: '#333',
  },
  sessionTime: {
    marginTop: 4,
    color: '#666',
  },
  sessionDay: {
    marginTop: 4,
    color: '#999',
  },
  sessionApproval: {
    marginTop: 4,
    fontWeight: 'bold',
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#F7941D',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 16,
  },
});

export default TrainerDashboardScreen;
