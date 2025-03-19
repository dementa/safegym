import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, TouchableRipple } from "react-native-paper";
import { IconButton } from "react-native-paper";

export default function SignupScreen() {
  const [signupMethod, setSignupMethod] = useState("email"); // "email" or "phone"
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log("Signup Data:", formData);
  };

  return (
    <View style={styles.container}>
      {/* Toggle Signup Mode */}
      <View style={styles.toggleContainer}>
        <TouchableRipple
          onPress={() => setSignupMethod("email")}
          style={[
            styles.toggleButton,
            signupMethod === "email" && styles.activeButton,
          ]}
        >
          <Text style={signupMethod === "email" ? styles.activeText : styles.inactiveText}>
            Email
          </Text>
        </TouchableRipple>
        <TouchableRipple
          onPress={() => setSignupMethod("phone")}
          style={[
            styles.toggleButton,
            signupMethod === "phone" && styles.activeButton,
          ]}
        >
          <Text style={signupMethod === "phone" ? styles.activeText : styles.inactiveText}>
            Phone number
          </Text>
        </TouchableRipple>
      </View>

      <Text style={styles.title}>Registration.</Text>

      {/* Conditional Rendering for Email or Phone */}
      {signupMethod === "email" ? (
        <TextInput
          label="Email"
          mode="outlined"
          placeholder="Enter your active email."
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          style={styles.input}
        />
      ) : (
        <TextInput
          label="Phone number"
          mode="outlined"
          placeholder="Enter your active phone number"
          value={formData.phone}
          onChangeText={(text) => handleChange("phone", text)}
          style={styles.input}
        />
      )}

      {/* Common Fields */}
      <TextInput
        label="First name"
        mode="outlined"
        placeholder="Enter your first name"
        value={formData.firstName}
        onChangeText={(text) => handleChange("firstName", text)}
        style={styles.input}
      />
      <TextInput
        label="Last name"
        mode="outlined"
        placeholder="Enter your last name"
        value={formData.lastName}
        onChangeText={(text) => handleChange("lastName", text)}
        style={styles.input}
      />
      <TextInput
        label="Password"
        mode="outlined"
        placeholder="At least 8 characters"
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
        style={styles.input}
      />

      {/* Create Account Button */}
      <Button mode="contained" onPress={handleSubmit} style={styles.createButton}>
        Create Account
      </Button>

      {/* Already have an account */}
      <Text style={styles.signInText}>
        Already have an account? <Text style={styles.signInLink}>Sign in</Text>
      </Text>

      {/* Social Login */}
      <Text style={styles.socialText}>Sign up with</Text>
      <View style={styles.socialIcons}>
        <IconButton icon="google" size={30} onPress={() => console.log("Google Login")} />
        <IconButton icon="facebook" size={30} onPress={() => console.log("Facebook Login")} />
        <IconButton icon="instagram" size={30} onPress={() => console.log("Instagram Login")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  toggleContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#444",
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  inactiveText: {
    color: "#777",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 10,
  },
  createButton: {
    width: "100%",
    backgroundColor: "#444",
    paddingVertical: 5,
    marginBottom: 20,
  },
  signInText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  signInLink: {
    color: "#000",
    fontWeight: "bold",
  },
  socialText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: "row",
    gap: 10,
  },
});

