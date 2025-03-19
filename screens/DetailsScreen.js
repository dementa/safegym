import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Button, Card, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const DetailsScreen = ({ route }) => {
  const { classData } = route.params;
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: classData.image }} style={styles.bannerImage} />
        <TouchableOpacity style={styles.selfTourButton}>
          <Text style={styles.selfTourText}>Self-tour</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.classTitle}>{classData.title}</Text>
        <Text style={styles.location}>By {classData.coach}</Text>
        <View style={styles.metaContainer}>
          <Text style={styles.rating}>⭐ {classData.rating}</Text>
          <Text style={styles.time}>{classData.time}</Text>
        </View>
        <Button mode="contained" style={styles.infoButton}>
          Get more info
        </Button>
        <Text style={styles.description}>{classData.description}</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>${classData.price}</Text>
        <Button mode="contained" style={styles.bookButton}>
          Book Now
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  imageContainer: { position: "relative" },
  bannerImage: { width: "100%", height: 250, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  selfTourButton: { position: "absolute", top: 20, right: 20, backgroundColor: "#007AFF", padding: 8, borderRadius: 10 },
  selfTourText: { color: "#fff", fontWeight: "bold" },
  detailsContainer: { padding: 20 },
  classTitle: { fontSize: 22, fontWeight: "bold" },
  location: { fontSize: 16, color: "gray", marginBottom: 10 },
  metaContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  rating: { fontSize: 16, fontWeight: "bold", color: "#FF9500" },
  time: { fontSize: 16, fontWeight: "bold" },
  infoButton: { marginVertical: 10, backgroundColor: "#007AFF" },
  description: { fontSize: 14, color: "gray", marginBottom: 20 },
  priceContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  price: { fontSize: 20, fontWeight: "bold", color: "#007AFF" },
  bookButton: { backgroundColor: "#007AFF" },
});

export default DetailsScreen;
