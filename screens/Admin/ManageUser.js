import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Image
} from 'react-native';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';

const ManageUsers = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
      setFilteredUsers(userList);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (searchText === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        user =>
          user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchText, users]);

  const handleDelete = async (userId) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'users', userId));
            Alert.alert('Success', 'User deleted');
          } catch (error) {
            console.error('Error deleting user:', error);
            Alert.alert('Error', 'Failed to delete user');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => {
        setSelectedUser(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.cardRow}>
        {item.profilePicture ? (
          <Image source={{ uri: item.profilePicture }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <MaterialIcons name="person" size={30} color="#BDBDBD" />
          </View>
        )}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.name}>{item.fullName || item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Users</Text>

      <View style={styles.topBar}>
        <TextInput
          placeholder="Search by name or email"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddUser')}
        >
          <MaterialIcons name="person-add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No users found.</Text>}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedUser && (
              <>
                {selectedUser.profilePicture && (
                  <Image source={{ uri: selectedUser.profilePicture }} style={styles.modalImage} />
                )}
                <Text style={styles.modalTitle}>{selectedUser.fullName || selectedUser.name}</Text>
                <Text>Email: {selectedUser.email}</Text>
                <Text>Phone: {selectedUser.phone || 'N/A'}</Text>
                <Text>Role: {selectedUser.role || 'N/A'}</Text>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate('EditUser', { user: selectedUser });
                    }}
                  >
                    <Text style={styles.modalBtnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#D32F2F' }]}
                    onPress={() => {
                      setModalVisible(false);
                      handleDelete(selectedUser.id);
                    }}
                  >
                    <Text style={styles.modalBtnText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#BDBDBD' }]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalBtnText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF3E0' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#EF6C00',
    textAlign: 'center'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFE0B2',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    color: '#EF6C00'
  },
  addButton: {
    backgroundColor: '#FB8C00',
    padding: 10,
    borderRadius: 8
  },
  userCard: {
    backgroundColor: '#FFE0B2',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    elevation: 1
  },
  name: { fontSize: 18, fontWeight: '600', color: '#EF6C00' },
  email: { fontSize: 14, color: '#8D6E63' },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#A1887F'
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EEE'
  },
  placeholderAvatar: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    margin: 20,
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    padding: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FB8C00',
    textAlign: 'center'
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#FB8C00',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  modalBtnText: { color: '#fff', fontWeight: 'bold' }
});

export default ManageUsers;
