import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import MyMapWeb from "../maps-handler/maps-view";
import MyMapMobile from "../maps-handler/maps-view-mobile";

const { width, height } = Dimensions.get("window");

const MapComponent = Platform.OS === "web" ? MyMapWeb : MyMapMobile;

const Card = ({ text }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

export default function App() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Poppins: Poppins_700Bold });
  const [showAction, setShowAction] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // State untuk me-refresh map:
  // Setiap kali nilai refreshKey berubah, MapComponent akan di-unmount & mount ulang.
  const [refreshKey, setRefreshKey] = useState(0);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#D32F2F" />;
  }

  const toggleActionOptions = () => {
    setShowAction(!showAction);
    if (!showAction) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  };

  // Fungsi refresh map: menambah angka agar key berubah
  const refreshMap = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#EFE7F7" }}>
      <Card text="Bagi Makan" />

      {/* Berikan prop key={refreshKey} ke MapComponent */}
      <MapComponent key={refreshKey} />

      {/* Tombol GPS */}
      <TouchableOpacity
        style={styles.gpsButton}
        onPress={() => console.log("GPS Clicked")} // Ganti sesuai kebutuhan
        activeOpacity={0.8}
      >
        <MaterialIcons name="gps-fixed" size={24} color="#D32F2F" />
      </TouchableOpacity>

      {/* Tombol Refresh Map */}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={refreshMap}
        activeOpacity={0.8}
      >
        <MaterialIcons name="refresh" size={24} color="#D32F2F" />
      </TouchableOpacity>

      {/* Tombol untuk memunculkan action options */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={toggleActionOptions}
        activeOpacity={0.8}
      >
        {!showAction && <MaterialIcons name="add" size={24} color="#D32F2F" />}
        {!showAction && <Text style={styles.addButtonText}>Mulai Aksi</Text>}
      </TouchableOpacity>

      {/* Action Options */}
      {showAction && (
        <Animated.View style={[styles.actionOptions, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => router.push("/addFood")}
          >
            <Text style={styles.optionText}>Tambah Makan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => router.push("/findFood")}
          >
            <Text style={styles.optionText}>Cari Makanan</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: "absolute",
    top: height * 0.08,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: width * 0.05,
    alignSelf: "center",
    maxWidth: width * 0.9,
    minWidth: width * 0.8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  text: {
    color: "#D32F2F",
    fontSize: width * 0.05,
    fontWeight: "bold",
    fontFamily: "Poppins",
    textAlign: "center",
  },
  gpsButton: {
    position: "absolute",
    bottom: height * 0.13,
    right: width * 0.06,
    backgroundColor: "white",
    padding: width * 0.03,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  // Tombol Refresh mirip gpsButton, tapi posisinya disesuaikan
  refreshButton: {
    position: "absolute",
    bottom: height * 0.2, // Atur sesuai kebutuhan
    right: width * 0.06,
    backgroundColor: "white",
    padding: width * 0.03,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  addButton: {
    position: "absolute",
    bottom: height * 0.05,
    right: width * 0.05,
    flexDirection: "row",
    backgroundColor: "white",
    padding: width * 0.04,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    paddingHorizontal: width * 0.04,
  },
  addButtonText: {
    color: "#D32F2F",
    fontWeight: "bold",
    marginLeft: width * 0.02,
  },
  actionOptions: {
    position: "absolute",
    bottom: height * 0.1,
    right: width * 0.05,
    backgroundColor: "white",
    borderRadius: 12,
    padding: width * 0.02,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  optionButton: {
    padding: width * 0.04,
    paddingVertical: height * 0.02,
    marginBottom: height * 0.0075,
    backgroundColor: "transparent",
    borderColor: "#D32F2F",
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    color: "#D32F2F",
    fontWeight: "bold",
    fontSize: width * 0.035,
  },
});
