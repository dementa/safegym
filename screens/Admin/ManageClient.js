import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, TextInput, Button, IconButton, Card, Dialog, Portal, Menu } from 'react-native-paper';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { clientManager } from '../../utils/resourceManager'; // similar to trainerManager

const ClientManagementScreen = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newMembershipStatus, setNewMembershipStatus] = useState('');
  const [newMembershipStart, setNewMembershipStart] = useState('');
  const [newMembershipEnd, setNewMembershipEnd] = useState('');
  const [newMembershipId, setNewMembershipId] = useState('');

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const membershipStatuses = ['Active', 'Inactive', 'Expired'];

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'clients'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClients(data);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    filterClients();
  }, [search, filterStatus, clients]);

  const filterClients = () => {
    const query = search.toLowerCase();
    const filtered = clients.filter(c => {
      const matchesSearch = (
        (c.firstName?.toLowerCase().includes(query)) ||
        (c.lastName?.toLowerCase().includes(query)) ||
        (c.email?.toLowerCase().includes(query))
      );
      const matchesStatus = filterStatus ? c.membershipStatus === filterStatus : true;
      return matchesSearch && matchesStatus;
    });
    setFilteredClients(filtered);
  };

  const openEditDialog = (client) => {
    setSelectedClient(client);
    setNewFirstName(client.firstName || '');
    setNewLastName(client.lastName || '');
    setNewEmail(client.email || '');
    setNewPhone(client.phone || '');
    setNewMembershipStatus(client.membershipStatus || '');
    setNewMembershipStart(client.membershipStart || '');
    setNewMembershipEnd(client.membershipEnd || '');
    setNewMembershipId(client.membershipId || '');
    setDialogVisible(true);
  };

  const handleUpdateClient = async () => {
    try {
      const updatedData = {
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        phone: newPhone,
        membershipStatus: newMembershipStatus,
        membershipStart: newMembershipStart,
        membershipEnd: newMembershipEnd,
        membershipId: newMembershipId,
      };

      await clientManager.updateResource(selectedClient.id, updatedData);

      setClients(prev =>
        prev.map(c => (c.id === selectedClient.id ? { ...c, ...updatedData } : c))
      );

      setDialogVisible(false);
    } catch (error) {
      console.error('Failed to update client:', error);
    }
  };

  const confirmDelete = (client) => {
    setClientToDelete(client);
    setDeleteDialogVisible(true);
  };

  const handleDeleteClient = async () => {
    try {
      await clientManager.deleteResource(clientToDelete.id);
      setClients(prev => prev.filter(c => c.id !== clientToDelete.id));
      setDeleteDialogVisible(false);
    } catch (error) {
      console.error('Failed to delete client:', error);
    }
  };

  const renderClient = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.info}>
          <Text variant="titleMedium">{item.firstName} {item.lastName}</Text>
          <Text>Email: {item.email}</Text>
          <Text>Phone: {item.phone}</Text>
          <Text>Status: {item.membershipStatus}</Text>
          <Text>Start: {item.membershipStart}</Text>
          <Text>End: {item.membershipEnd}</Text>
          <Text>ID: {item.membershipId}</Text>
        </View>
        <View style={styles.actions}>
          <IconButton icon="pencil" iconColor="#FF6F00" onPress={() => openEditDialog(item)} />
          <IconButton icon="delete" iconColor="#B00020" onPress={() => confirmDelete(item)} />
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>Client Management</Text>

      <TextInput
        placeholder="Search by name or email"
        value={search}
        onChangeText={setSearch}
        mode="outlined"
        style={styles.searchInput}
      />

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            style={styles.filterBtn}
          >
            {filterStatus || 'Filter by Status'}
          </Button>
        }
      >
        {membershipStatuses.map(status => (
          <Menu.Item
            key={status}
            onPress={() => {
              setFilterStatus(status);
              setMenuVisible(false);
            }}
            title={status}
          />
        ))}
        <Menu.Item
          onPress={() => {
            setFilterStatus('');
            setMenuVisible(false);
          }}
          title="Clear Filter"
        />
      </Menu>

      <FlatList
        data={filteredClients}
        keyExtractor={item => item.id}
        renderItem={renderClient}
        contentContainerStyle={styles.list}
      />

      {/* Edit Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Edit Client</Dialog.Title>
          <Dialog.Content>
            <TextInput label="First Name" value={newFirstName} onChangeText={setNewFirstName} mode="outlined" />
            <TextInput label="Last Name" value={newLastName} onChangeText={setNewLastName} mode="outlined" />
            <TextInput label="Email" value={newEmail} onChangeText={setNewEmail} mode="outlined" />
            <TextInput label="Phone" value={newPhone} onChangeText={setNewPhone} mode="outlined" />
            <TextInput label="Membership Status" value={newMembershipStatus} onChangeText={setNewMembershipStatus} mode="outlined" />
            <TextInput label="Membership Start" value={newMembershipStart} onChangeText={setNewMembershipStart} mode="outlined" />
            <TextInput label="Membership End" value={newMembershipEnd} onChangeText={setNewMembershipEnd} mode="outlined" />
            <TextInput label="Membership ID" value={newMembershipId} onChangeText={setNewMembershipId} mode="outlined" />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleUpdateClient}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Delete Dialog */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Confirm Deletion</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete client <Text style={{ fontWeight: 'bold' }}>{clientToDelete?.firstName} {clientToDelete?.lastName}</Text>?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDeleteClient} textColor="red">Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    flex: 1
  },
  heading: {
    color: '#3366CC',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold'
  },
  searchInput: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  filterBtn: {
    marginBottom: 12,
    backgroundColor: '#eee',
    borderColor: '#3366CC'
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  }
});

export default ClientManagementScreen;
