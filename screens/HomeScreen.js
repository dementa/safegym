import React from "react";
import { View, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Card, Text, Title, Paragraph } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar, IconButton } from "react-native-paper";
import GymClassesCard from "../components/gymCards";
import TrendingCard from "../components/TrendingCards";


const appointments = [
  {
    id: "1",
    title: "Yuga Master Class",
    trainer: "trainer Vic",
    phone: "+256 758 019 072",
    time: "8:00 PM",
    date: "4 Feb 2024",
    status: "Pending",
    image: "https://randomuser.me/api/portraits/men/1.jpg", // Sample image URL
  },
  {
    id: "2",
    title: "Cardio Workout",
    trainer: "Jane Smith",
    phone: "+256 701 987 654",
    time: "6:30 AM",
    date: "5 Feb 2024",
    status: "Confirmed",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "3",
    title: "Strength Training",
    trainer: "John Doe",
    phone: "+256 700 123 456",
    time: "10:00 AM",
    date: "6 Feb 2024",
    status: "Completed",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "4",
    title: "Yuga Master Class",
    trainer: "trainer Vic",
    phone: "+256 758 019 072",
    time: "8:00 PM",
    date: "4 Feb 2024",
    status: "Pending",
    image: "https://randomuser.me/api/portraits/men/1.jpg", // Sample image URL
  },
  {
    id: "5",
    title: "Cardio Workout",
    trainer: "Jane Smith",
    phone: "+256 701 987 654",
    time: "6:30 AM",
    date: "5 Feb 2024",
    status: "Confirmed",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "6",
    title: "Strength Training",
    trainer: "John Doe",
    phone: "+256 700 123 456",
    time: "10:00 AM",
    date: "6 Feb 2024",
    status: "Completed",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

const HomeScreen = () => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Title style={{ marginBottom: 8, marginLeft: 16 }}>My Appointments</Title>

      <ScrollView horizontal style={{padding: 16, flexDirection: "row" }}>
        { appointments.map(({ id, title, trainer, phone, time, date, status, image }) => (
          <Card style={styles.card} key={id}>
            <Card.Title
              title={title}
              subtitle={`By ${trainer}`}
              left={(props) => <Avatar.Image {...props} source={{ uri: image }} />}
              right={(props) => <IconButton {...props} icon="dots-vertical" />}
              styles={{fontSize: 48}}
            />
            <Card.Content style={{flex: 1, flexDirection: "row", }}>
              <Text>
                <Text style={styles.phone}>{phone}</Text>
                <Text style={styles.contact}>Contact</Text>
                <Text style={styles.time}>{time}</Text>
                <Text style={styles.date}>{date}</Text>
              </Text>
            </Card.Content>
            <Card.Actions>
              <Text style={styles.status}>{status}</Text>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
      <GymClassesCard/>
      <TrendingCard/>
      <GymClassesCard/>
      <GymClassesCard/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 300,
    marginRight: 16,
    borderRadius: 10,
    height: 220,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3, // Adds shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  phone: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 4,
  },
  contact: {
    fontSize: 12,
    color: "#777",
    marginBottom: 8,
  },
  time: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
    backgroundColor: "#007bff", // Default color for pending
  },
  info: {
    flex: 1,
    flexDirection: "column",
  }
});


export default HomeScreen;
