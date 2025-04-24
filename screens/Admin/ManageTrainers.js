import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, Alert } from 'react-native';
import { Text, TextInput, Menu, Button, IconButton, Card, Dialog, Portal, HelperText, SegmentedButtons } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { trainerManager } from '../../utils/resourceManager';

const TrainerManagementScreen = () => {
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState(null);

  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [addFirstName, setAddFirstName] = useState('');
  const [addLastName, setAddLastName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addSpecialization, setAddSpecialization] = useState('');
  const [addImageUrl, setAddImageUrl] = useState('');

  const specializations = [
    'Weight Training', 'Cardio Fitness', 'Yoga', 'Pilates',
    'CrossFit', 'Strength & Conditioning', 'Zumba',
    'Bodybuilding', 'HIIT', 'Rehabilitation'
  ];

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'trainers'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTrainers(data);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    filterTrainers();
  }, [search, filterSpecialization, trainers]);

  const filterTrainers = () => {
    const query = search.toLowerCase();
    const filtered = trainers.filter(t => {
      const matchesSearch = (
        (t.firstName?.toLowerCase().includes(query)) ||
        (t.lastName?.toLowerCase().includes(query)) ||
        (t.email?.toLowerCase().includes(query))
      );
      const matchesSpec = filterSpecialization ? t.specialization === filterSpecialization : true;
      return matchesSearch && matchesSpec;
    });
    setFilteredTrainers(filtered);
  };

  const openEditDialog = (trainer) => {
    setSelectedTrainer(trainer);
    setNewFirstName(trainer.firstName || '');
    setNewLastName(trainer.lastName || '');
    setNewEmail(trainer.email || '');
    setNewPhone(trainer.phone || '');
    setNewSpecialization(trainer.specialization || '');
    setNewImageUrl(trainer.imageUrl || '');
    setDialogVisible(true);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setNewImageUrl(result.assets[0].uri);
    }
  };

  const pickAddImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAddImageUrl(result.assets[0].uri);
    }
  };

  const handleUpdateTrainer = async () => {
    try {
      const updatedData = {
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        phone: newPhone,
        specialization: newSpecialization,
        imageUrl: newImageUrl,
      };

      await trainerManager.updateResource(selectedTrainer.id, updatedData);

      setTrainers(prev =>
        prev.map(t => (t.id === selectedTrainer.id ? { ...t, ...updatedData } : t))
      );

      setDialogVisible(false);
    } catch (error) {
      console.error('Failed to update trainer:', error);
    }
  };

  const handleAddTrainer = async () => {
    const newTrainer = {
      firstName: addFirstName.trim().toUpperCase(),
      lastName: addLastName.trim().toUpperCase(),
      email: addEmail.trim(),
      phone: addPhone,
      specialization: addSpecialization,
      imageUrl: addImageUrl,
    };

    try {
      const docRef = await trainerManager.addResource(newTrainer);
      setTrainers(prev => [...prev, { ...newTrainer, id: docRef.id }]);
      setAddDialogVisible(false);
      setAddFirstName('');
      setAddLastName('');
      setAddEmail('');
      setAddPhone('');
      setAddSpecialization('');
      setAddImageUrl('');
    } catch (error) {
      console.error('Failed to add trainer:', error);
    }
  };

  const confirmDelete = (trainer) => {
    setTrainerToDelete(trainer);
    setDeleteDialogVisible(true);
  };

  const handleDeleteTrainer = async () => {
    try {
      await trainerManager.deleteResource(trainerToDelete.id);
      setTrainers(prev => prev.filter(t => t.id !== trainerToDelete.id));
      setDeleteDialogVisible(false);
    } catch (error) {
      console.error('Failed to delete trainer:', error);
    }
  };

  const renderTrainer = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.info}>
          <Text variant="titleMedium">{item.firstName} {item.lastName}</Text>
          <Text>Email: {item.email}</Text>
          <Text>Phone: {item.phone}</Text>
          <Text>Specialization: {item.specialization}</Text>
          <Text>Trainer ID: {item.id}</Text>
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
      <Text variant="headlineMedium" style={styles.heading}>Trainer Management</Text>

      <Button
        icon="plus"
        mode="contained"
        onPress={() => setAddDialogVisible(true)}
        style={{ marginBottom: 12, backgroundColor: '#FF6F00' }}
      >
        Add Trainer
      </Button>

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
            {filterSpecialization || 'Filter by Specialization'}
          </Button>
        }
      >
        {specializations.map(spec => (
          <Menu.Item
            key={spec}
            onPress={() => {
              setFilterSpecialization(spec);
              setMenuVisible(false);
            }}
            title={spec}
          />
        ))}
        <Menu.Item
          onPress={() => {
            setFilterSpecialization('');
            setMenuVisible(false);
          }}
          title="Clear Filter"
        />
      </Menu>

      <FlatList
        data={filteredTrainers}
        keyExtractor={item => item.id}
        renderItem={renderTrainer}
        contentContainerStyle={styles.list}
      />

      {/* 🔧 Edit Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Edit Trainer</Dialog.Title>
          <Dialog.Content>
            <TextInput label="First Name" value={newFirstName} onChangeText={setNewFirstName} mode="outlined" />
            <TextInput label="Last Name" value={newLastName} onChangeText={setNewLastName} mode="outlined" />
            <TextInput label="Email" value={newEmail} onChangeText={setNewEmail} mode="outlined" />
            <TextInput label="Phone" value={newPhone} onChangeText={setNewPhone} mode="outlined" />
            <TextInput label="Specialization" value={newSpecialization} onChangeText={setNewSpecialization} mode="outlined" />
            <Button mode="outlined" onPress={pickImage} style={{ marginTop: 8 }}>Change Image</Button>
            {newImageUrl ? <Image source={{ uri: newImageUrl }} style={{ width: '100%', height: 150, marginTop: 8 }} /> : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleUpdateTrainer}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* ➕ Add Dialog */}
      <Portal>
        <Dialog visible={addDialogVisible} onDismiss={() => setAddDialogVisible(false)}>
          <Dialog.Title>Add New Trainer</Dialog.Title>
          <Dialog.Content>
            <TextInput label="First Name" value={addFirstName} onChangeText={setAddFirstName} mode="outlined" />
            <TextInput label="Last Name" value={addLastName} onChangeText={setAddLastName} mode="outlined" />
            <TextInput label="Email" value={addEmail} onChangeText={setAddEmail} mode="outlined" />
            <TextInput label="Phone" value={addPhone} onChangeText={setAddPhone} mode="outlined" />
            <HelperText type="info">Starts with +256 or 0, followed by 9 digits</HelperText>
            <Text style={{ marginTop: 12, marginBottom: 4 }}>Specialization</Text>
            <SegmentedButtons
              value={addSpecialization}
              onValueChange={setAddSpecialization}
              buttons={specializations.slice(0, 3).map(spec => ({ value: spec, label: spec }))}
              style={{ marginBottom: 8 }}
            />
            <Button mode="outlined" onPress={pickAddImage} style={{ marginTop: 8 }}>
              Pick Profile Image
            </Button>
            {addImageUrl ? (
              <Image source={{ uri: addImageUrl }} style={{ width: '100%', height: 150, marginTop: 8 }} />
            ) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAddDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleAddTrainer}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* 🗑️ Delete Confirmation */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Confirm Deletion</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete trainer <Text style={{ fontWeight: 'bold' }}>{trainerToDelete?.firstName} {trainerToDelete?.lastName}</Text>?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDeleteTrainer} textColor="red">Delete</Button>
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
    color: '#FF6F00',
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
    borderColor: '#FF6F00'
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
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  }
});

export default TrainerManagementScreen;
