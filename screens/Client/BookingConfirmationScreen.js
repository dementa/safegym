import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BookingConfirmationScreen = ({ route, navigation }) => {
  const { appointmentId, sessionId, trainerId, clientId } = route.params;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Icon name="check-circle" size={60} color="#4CAF50" style={styles.icon} />
          <Title style={styles.title}>Booking Confirmed!</Title>
          <View style={styles.detailsContainer}>
            <Paragraph style={styles.detail}>
              <Text style={styles.label}>Appointment ID:</Text> {appointmentId}
            </Paragraph>
            <Paragraph style={styles.detail}>
              <Text style={styles.label}>Session ID:</Text> {sessionId}
            </Paragraph>
            <Paragraph style={styles.detail}>
              <Text style={styles.label}>Trainer ID:</Text> {trainerId}
            </Paragraph>
            <Paragraph style={styles.detail}>
              <Text style={styles.label}>Client ID:</Text> {clientId}
            </Paragraph>
          </View>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('MainApp', { redirectTo: 'HomeScreen' })}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            icon="home"
          >
            Back to Home
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default BookingConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  detail: {
    fontSize: 16,
    color: '#555',
    marginVertical: 8,
    textAlign: 'left',
  },
  label: {
    fontWeight: '600',
    color: '#FFA726',
  },
  actions: {
    justifyContent: 'center',
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#FFA726',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 20,
    width: '80%',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});