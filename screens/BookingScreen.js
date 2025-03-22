import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import { DatePickerModal } from "react-native-paper-dates";
import { format } from "date-fns";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useAuthStore } from "../store/authStore";

// 🔹 Register English Locale
import { registerTranslation } from "react-native-paper-dates";
registerTranslation("en", {
  save: "Save",
  close: "Close",
  selectSingle: "Select date",
  typeInDate: "Type in date",
  previous: "Previous",
  next: "Next",
});

const BookingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { classData, userId } = route.params || {}; // User ID & class data passed from previous screen
  const { user } = useAuthStore();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirm = (params) => {
    setShowDatePicker(false);
    if (params.date) setSelectedDate(params.date);
  };

  // 🔹 Store Booking in Firestore
  const handleBooking = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, "appointments"), {
        userId: user.email, // Store which user made the booking
        classTitle: classData.title,
        trainer: classData.trainer,
        time: classData.time, // Fixed class time
        date: format(selectedDate, "yyyy-MM-dd"), // Store date in Firestore format
        status: "booked", // Default status
        createdAt: new Date(),
      });

      Alert.alert("Success", "Your appointment has been booked!");
      navigation.goBack(); // Navigate back after booking
    } catch (error) {
      Alert.alert("Error", "Failed to book appointment. Try again.");
      console.error("Firestore Error:", error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Display Class Info */}
      <Card>
        <Card.Cover source={{ uri: classData.image }} />
        <Card.Content>
          <Text variant="titleLarge">{classData.title}</Text>
          <Text variant="bodyMedium">Trainer: {classData.trainer}</Text>
          <Text variant="bodySmall">Time: {classData.time} (Fixed)</Text>
        </Card.Content>
      </Card>

      {/* Date Picker */}
      <Text variant="bodyMedium" style={styles.label}>Select Date:</Text>
      <Button mode="outlined" onPress={() => setShowDatePicker(true)}>
        {format(selectedDate, "PPP")}
      </Button>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={showDatePicker}
        onDismiss={() => setShowDatePicker(false)}
        date={selectedDate}
        onConfirm={onConfirm}
      />

      {/* Confirm Booking */}
      <Button mode="contained" onPress={handleBooking} loading={loading} style={styles.button}>
        {loading ? "Booking..." : "Confirm Booking"}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { marginTop: 20, fontSize: 16 },
  button: { marginTop: 20 },
});

export default BookingScreen;
