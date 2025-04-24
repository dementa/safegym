import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text } from 'react-native-paper';

const TrainerDetails = ({ route }) => {
  const { trainer } = route.params;

  return (
    <View style={styles.container}>
      <Avatar.Image size={100} source={trainer.img} />
      <Text variant="titleLarge" style={{ marginTop: 16 }}>{trainer.name}</Text>
      <Text variant="bodyMedium">{trainer.spec}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20 }
});

export default TrainerDetails;
