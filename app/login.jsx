import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { TextInput, Button, Modal, Portal, Provider } from "react-native-paper";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const { width } = Dimensions.get("window");

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }

  const showPopup = (message) => {
    setPopupMessage(message);
    setVisible(true);
  };

  // Hide popup modal
  const hidePopup = () => setVisible(false);

  const handleLogin = async () => {
    if (!username || !password) {
      showPopup("Username dan password tidak boleh kosong!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://mobile-be.berbagibitesjogja.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "password",
          username: username,
          password: password,
        }).toString(),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        await AsyncStorage.setItem("token", data.access_token);
        router.replace("(nav)/home");
      } else if (response.status === 404) {
        showPopup("Akun tidak ditemukan. Silakan daftar terlebih dahulu.");
      } else if (response.status === 403) {
        showPopup("Username atau password salah. Coba lagi.");
      } else {
        showPopup(data.detail || "Terjadi kesalahan saat login.");
      }
    } catch (error) {
      setLoading(false);
      showPopup("Gagal menghubungkan ke server.");
    }
  };

  return (
    <Provider>
      <View style={[styles.container, { paddingHorizontal: width * 0.05 }]}>
        <Text style={styles.title}>BagiMakan!</Text>

        <Text style={styles.heading}>Masuk</Text>
        <Text style={styles.subtext}>Masukkan username dan kata sandi</Text>

        <TextInput
          label="Username"
          mode="outlined"
          value={username}
          onChangeText={setUsername}
          style={[
            styles.input,
            { width: width * 0.9, backgroundColor: "white" },
          ]}
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

        <TextInput
          label="Kata sandi"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          right={
            <TextInput.Icon
              icon={passwordVisible ? "eye-off" : "eye"}
              onPress={() => setPasswordVisible(!passwordVisible)}
            />
          }
          style={[
            styles.input,
            { width: width * 0.9, backgroundColor: "white" },
          ]}
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

        <Button
          mode="contained"
          onPress={handleLogin}
          style={[styles.button, { width: width * 0.9 }]}
          loading={loading}
          disabled={loading}
        >
          Masuk
        </Button>

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.registerText}>
            Belum punya akun? <Text style={styles.registerLink}>Daftar</Text>
          </Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#F9A826",
    paddingVertical: 8,
    marginTop: 10,
  },
  registerText: {
    marginTop: 30,
    fontSize: 14,
    color: "#666",
  },
  registerLink: {
    fontWeight: "bold",
    color: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
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
