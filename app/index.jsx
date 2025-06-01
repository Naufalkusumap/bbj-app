import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins";
import LoginScreen from "./login";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Load fonts using expo-font
  const [fontsLoaded] = useFonts({
    Poppins_700Bold, // Ensure that the Poppins font is loaded
  });

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Change this value to control the splash screen duration
  }, []);

  // Wait until the font is loaded
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.title}>BagiMakan!</Text>
      ) : (
        <LoginScreen />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Makes it take the full screen
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5", // Optional: You can add a background color
  },
  title: {
    fontFamily: "Poppins_700Bold", // Apply the Poppins font
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  loadingContainer: {
    flex: 1, // Makes it take the full screen
    justifyContent: "center", // Center the ActivityIndicator vertically
    alignItems: "center", // Center the ActivityIndicator horizontally
    backgroundColor: "#F5F5F5", // Optional: You can add a background color
  },
});
