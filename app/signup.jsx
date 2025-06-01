import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  ActivityIndicator,
  Modal,
  Portal,
  Provider,
} from "react-native-paper";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // Load fonts using expo-font
  const [fontsLoaded] = useFonts({
    Poppins_700Bold, // Ensure that the Poppins font is loaded
  });

  // Wait until the font is loaded
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }

  // Function to show modal popup
  const showPopup = (message) => {
    setPopupMessage(message);
    setVisible(true);
  };

  // Hide modal popup
  const hidePopup = () => setVisible(false);

  // Function to handle signup
  const handleSignup = async () => {
    if (!name || !email || !phone || !password) {
      showPopup("Semua bidang harus diisi!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://mobile-be.berbagibitesjogja.com/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          password: password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        await AsyncStorage.setItem("token", data.access_token);
        showPopup("Pendaftaran berhasil! Silakan login.");
        setTimeout(() => {
          hidePopup();
          router.replace("/login");
        }, 1500);
      } else {
        showPopup(data.detail || "Gagal mendaftar. Silakan coba lagi.");
      }
    } catch (error) {
      setLoading(false);
      showPopup("Gagal menghubungkan ke server.");
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>BagiMakan!</Text>

        {/* Signup Heading */}
        <Text style={styles.heading}>Daftar</Text>
        <Text style={styles.subtext}>
          Daftarkan akun Anda, lalu lanjutkan login.
        </Text>

        {/* Name Input */}
        <TextInput
          label="Nama"
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={styles.input}
          theme={{
            colors: {
              background: "white",
              text: "black",
              primary: "#F9A826",
              placeholder: "black",
            },
          }}
          outlineColor="#D9D9D9"
          textColor="black"
        />

        {/* Email Input */}
        <TextInput
          label="E-mail"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
          theme={{
            colors: {
              background: "white",
              text: "black",
              primary: "#F9A826",
              placeholder: "black",
            },
          }}
          outlineColor="#D9D9D9"
          textColor="black"
        />

        {/* Phone Number Input */}
        <TextInput
          label="No Telpon"
          mode="outlined"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
          theme={{
            colors: {
              background: "white",
              text: "black",
              primary: "#F9A826",
              placeholder: "black",
            },
          }}
          outlineColor="#D9D9D9"
          textColor="black"
        />

        {/* Password Input */}
        <TextInput
          label="Kata sandi"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          theme={{
            colors: {
              background: "white",
              text: "black",
              primary: "#F9A826",
              placeholder: "black",
            },
          }}
          outlineColor="#D9D9D9"
          textColor="black"
        />

        {/* Signup Button */}
        <Button
          mode="contained"
          onPress={handleSignup}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Daftar
        </Button>

        {/* Login Link */}
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginText}>Sudah punya akun? Masuk</Text>
        </TouchableOpacity>
      </View>

      {/* Popup Modal */}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hidePopup}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalText}>{popupMessage}</Text>
          <Button
            mode="contained"
            onPress={hidePopup}
            style={styles.modalButton}
          >
            OK
          </Button>
        </Modal>
      </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 90,
    fontFamily: "Poppins_700Bold",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  subtext: {
    fontSize: 14,
    color: "#666",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "white",
  },
  button: {
    width: "100%",
    backgroundColor: "#F9A826",
    paddingVertical: 8,
    marginTop: 10,
  },
  loginText: {
    marginTop: 20,
    fontWeight: "bold",
    color: "#000",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#F9A826",
  },
});
