import React from "react";
import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Title, Paragraph, Avatar, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import GymCard from "./card";

// Sample data for gym classes
const gymClasses = [
    {
      id: 1,
      title: "Yoga Master Class",
      coach: "Coach Ricky",
      description: "Talk to your inner person for a better you.",
      rating: 4.5,
      time: "20:00 GMT",
      image: "https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      categories: ["workout", "recommended", "trending"],
    },
    {
      id: 2,
      title: "HIIT Workout",
      coach: "Trainer Alex",
      description: "High-intensity interval training to burn calories.",
      rating: 4.7,
      time: "18:30 GMT",
      image: "https://images.pexels.com/photos/2204196/pexels-photo-2204196.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      categories: ["workout", "recommended"],
    },
    {
      id: 3,
      title: "Strength Training",
      coach: "Coach Sarah",
      description: "Build muscle and gain strength effectively.",
      rating: 4.8,
      time: "19:00 GMT",
      image: "https://images.unsplash.com/photo-1589927986089-3581237893c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDF8fGZpdG5lc3N8ZW58MHx8fHwxNjYyMjY0MjA0&ixlib=rb-1.2.1&q=80&w=400",
      categories: ["workout", "trending"],
    },
    {
      id: 4,
      title: "Nutrition Consultancy",
      coach: "Nutritionist Emma",
      description: "Get personalized nutrition advice for your fitness goals.",
      rating: 4.9,
      time: "15:00 GMT",
      image: "https://images.pexels.com/photos/3825535/pexels-photo-3825535.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      categories: ["consultancy", "recommended"],
    },
    {
      id: 5,
      title: "Group Fitness Class",
      coach: "Coach Mike",
      description: "Join a fun group workout session.",
      rating: 4.6,
      time: "17:00 GMT",
      image: "https://images.pexels.com/photos/3825536/pexels-photo-3825536.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      categories: ["workout", "trending"],
    },
    {
      id: 6,
      title: "Pilates Class",
      coach: "Coach Anna",
      description: "Improve your core strength and flexibility.",
      rating: 4.4,
      time: "16:00 GMT",
      image: "https://images.pexels.com/photos/3825537/pexels-photo-3825537.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      categories: ["workout", "recommended"],
    },
    {
      id: 7,
      title: "Cardio Kickboxing",
      coach: "Trainer John",
      description: "A high-energy workout combining cardio and kickboxing.",
      rating: 4.3,
      time: "14:00 GMT",
      image: "https://images.pexels.com/photos/3825538/pexels-photo-3825538.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      categories: ["workout", "trending"],
    },
    {
      id: 8,
      title: "Zumba Dance Class",
      coach: "Coach Lisa",
      description: "Dance your way to fitness with Zumba.",
      rating: 4.6,
      time: "19:30 GMT",
      image: "https://images.pexels.com/photos/3825539/pexels-photo-3825539.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      categories: ["workout", "recommended"],
    },
    {
        id: 9,
        title: "Bodyweight Training",
        coach: "Coach Tom",
        description: "Use your body weight for strength training.",
        rating: 4.5,
        time: "11:00 GMT",
        image: "https://images.pexels.com/photos/3825540/pexels-photo-3825540.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        categories: ["workout", "trending"],
      },
      {
        id: 10,
        title: "Meditation and Mindfulness",
        coach: "Coach Maya",
        description: "Learn techniques to calm your mind and reduce stress.",
        rating: 4.8,
        time: "09:00 GMT",
        image: "https://images.pexels.com/photos/3825541/pexels-photo-3825541.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        categories: ["consultancy", "recommended"],
      },
      {
        id: 11,
        title: "Kettlebell Training",
        coach: "Trainer Jake",
        description: "A dynamic workout using kettlebells for strength and endurance.",
        rating: 4.6,
        time: "12:00 GMT",
        image: "https://images.pexels.com/photos/3825542/pexels-photo-3825542.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        categories: ["workout", "trending"],
      },
      {
        id: 12,
        title: "Cycling Class",
        coach: "Coach Sam",
        description: "Join a high-energy cycling session.",
        rating: 4.7,
        time: "13:00 GMT",
        image: "https://images.pexels.com/photos/3825543/pexels-photo-3825543.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        categories: ["workout", "recommended"],
      },
      {
        id: 13,
        title: "Functional Training",
        coach: "Coach Nick",
        description: "Train your body for everyday activities.",
        rating: 4.4,
        time: "15:30 GMT",
        image: "https://images.pexels.com/photos/3825544/pexels-photo-3825544.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        categories: ["workout", "trending"],
      },
      {
        id: 14,
        title: "Boxing Fitness",
        coach: "Trainer Leo",
        description: "Get fit while learning boxing techniques.",
        rating: 4.5,
        time: "16:30 GMT",
        image: "https://images.pexels.com/photos/3825545/pexels-photo-3825545.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        categories: ["workout", "recommended"],
      },
      {
        id: 15,
        title: "Dance Cardio",
        coach: "Coach Zoe",
        description: "A fun way to get your heart pumping through dance.",
        rating: 4.6,
        time: "17:30 GMT",
        image: "https://images.pexels.com/photos/3825546/pexels-photo-3825546.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        categories: ["workout", "trending"],
      },
      {
        id: 16,
        title: "Core Strength Training",
        coach: "Coach Ava",
        description: "Focus on building a strong core.",
        rating: 4.7,
        time: "10:00 GMT",
        image: "https://images.pexels.com/photos/3825547/pexels-photo-3825547.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        categories: ["workout", "recommended"],
      },
      {
        id: 18,
        title: "CrossFit Training",
        coach: "Coach Ethan",
        description: "A high-intensity workout combining various exercises.",
        rating: 4.9,
        time: "12:30 GMT",
        image: "https://images.pexels.com/photos/3825549/pexels-photo-3825549.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        categories: ["workout", "trending"],
      },
      {
        id: 19,
        title: "Meditation Retreat",
        coach: "Coach Lily",
        description: "A weekend retreat focused on meditation and relaxation.",
        rating: 4.8,
        time: "All Day",
        image: "https://images.pexels.com/photos/3825550/pexels-photo-3825550.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        categories: ["consultancy", "recommended"],
      },
      {
        id: 20,
        title: "Outdoor Bootcamp",
        coach: "Coach Oliver",
        description: "A challenging workout in the great outdoors.",
        rating: 4.6,
        time: "08:00 GMT",
        image: "https://images.pexels.com/photos/3825551/pexels-photo-3825551.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        categories: ["workout", "trending"],
      },
    ];

const GymClassesCard = () => {
  const navigation = useNavigation(); // Get navigation object

  return (
    <View>

        <View>
            <Text style={{ marginBottom: 8, marginLeft: 16, fontSize: 24}}>Available Slots</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
              {gymClasses.map((item) => (
                <GymCard id={item.id} key={item.id} {...item} onPress={() => navigation.navigate("Details", { classData: item })}/>
              ))}
            </ScrollView>
        </View>
    </View>
  );
};



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

export default GymClassesCard;
