import React from "react";
import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Title, Paragraph, Avatar, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


const GymCard = ({id, image, title, description, coach, time, rating, category, onPress}) => {
  const navigation = useNavigation(); // Get navigation object

  return (
    <TouchableOpacity onPress={onPress}>
        <Card style={styles.card}>
        <Card.Cover source={{ uri: image }} style={styles.image} />
        <Card.Content>
            <Title style={styles.title}>{title}</Title>
            <View style={styles.row}>
            <Avatar.Image size={24} source={{ uri: "https://randomuser.me/api/portraits/men/3.jpg" }} />
            <Text style={styles.coach}>By {coach}</Text>
            </View>
            <Paragraph>{description}</Paragraph>
            <View style={styles.footer}>
            <View style={styles.rating}>
                <MaterialIcons name="star" size={18} color="gold" />
                <Text>{rating}</Text>
            </View>
            <Text>{time}</Text>
            </View>
        </Card.Content>
        </Card>
    </TouchableOpacity>
)};

const styles = StyleSheet.create({
  scrollView: {
    padding: 10,
  },
  card: {
    width: 250,
    marginRight: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    height: 140,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  coach: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default GymCard;