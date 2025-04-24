import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, TextInput, Modal, Pressable
} from 'react-native';
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';

const ManageSessions = ({ navigation }) => {
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'sessions'), (snapshot) => {
      const sessionList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSessions(sessionList);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (sessionId) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'sessions', sessionId));
            Alert.alert('Deleted', 'Session deleted successfully');
          } catch (error) {
            console.error('Error deleting session:', error);
            Alert.alert('Error', 'Failed to delete session');
          }
        }
      }
    ]);
  };

  const handleStatusUpdate = async (sessionId, approved) => {
    try {
      await updateDoc(doc(db, 'sessions', sessionId), { approved });
      Alert.alert('Success', `Session ${approved}`);
    } catch (error) {
      console.error(`Error updating status to ${approved}:`, error);
      Alert.alert('Error', `Failed to ${approved} session`);
    }
  };

  const filteredSessions = sessions
    .filter((item) =>
      (filter === 'all' || item.approved === filter) &&
      (item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.trainerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.clientName?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setSelectedSession(item);
      setModalVisible(true);
    }} style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>Status: <Text style={{ color: getStatusColor(item.approved) }}>{item.approved}</Text></Text>
      <Text>Trainer: {item.trainerID}</Text>
      <Text>Slots: {item.slots}</Text>

      <View style={styles.actions}>
        {item.approved === 'pending' && (
          <>
            <TouchableOpacity onPress={() => handleStatusUpdate(item.id, 'approved')} style={styles.approveBtn}>
              <Text style={styles.btnText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleStatusUpdate(item.id, 'rejected')} style={styles.rejectBtn}>
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('EditSession', { session: item })}>
          <MaterialIcons name="edit" size={24} color="#0277BD" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <MaterialIcons name="delete" size={24} color="#D32F2F" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'pending': return '#FF8F00';
      default: return '#333';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Sessions</Text>

      <TextInput
        placeholder="Search by title, trainer or client"
        style={styles.search}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.filterRow}>
        {['all', 'pending', 'approved', 'rejected'].map(status => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterBtn,
              filter === status && styles.activeFilter
            ]}
            onPress={() => setFilter(status)}
          >
            <Text style={filter === status ? styles.activeText : styles.filterText}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredSessions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No sessions found.</Text>}
      />

      {/* Modal for details */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedSession?.title}</Text>
            <Text>Status: {selectedSession?.status}</Text>
            <Text>Trainer: {selectedSession?.trainerName}</Text>
            <Text>Client: {selectedSession?.clientName}</Text>
            <Text>Day: {selectedSession?.day}</Text>
            <Text>Time: {selectedSession?.time}</Text>
            <Text>Slots: {selectedSession?.availableSlots}</Text>
            <Pressable onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Text style={{ color: '#fff' }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', color: '#FF6F00' },
  search: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#ECEFF1'
  },
  activeFilter: {
    backgroundColor: '#FFB300'
  },
  filterText: {
    color: '#333'
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#388E3C',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 16
  },
  addText: { color: '#fff', marginLeft: 8, fontWeight: 'bold' },
  card: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    elevation: 1
  },
  title: { fontSize: 18, fontWeight: '600', color: '#EF6C00' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  approveBtn: {
    backgroundColor: '#0288D1',
    padding: 6,
    borderRadius: 4
  },
  rejectBtn: {
    backgroundColor: '#D32F2F',
    padding: 6,
    borderRadius: 4
  },
  btnText: { color: '#fff' },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999'
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  closeBtn: {
    backgroundColor: '#37474F',
    padding: 10,
    borderRadius: 6,
    marginTop: 20,
    alignItems: 'center'
  }
});

export default ManageSessions;
