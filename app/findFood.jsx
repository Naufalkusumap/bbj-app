import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

import MapSetMobile from "./maps-handler/maps-set-mobile";

const AddScreen = () => {
  const router = useRouter();

  const MapComponent = Platform.OS === "web" ? null : MapSetMobile;

  // State untuk menyimpan input dari pengguna
  // const [waktu, setWaktu] = useState(new Date().toISOString().slice(0, 16));
  const [waktu, setWaktu] = useState(new Date());
  const [koordinat, setKoordinat] = useState("");
  const [namaPencari, setNamaPencari] = useState("");
  const [nomorPencari, setNomorPencari] = useState("");
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [namaTempat, setNamaTempat] = useState("");
  const [jumlahMakanan, setJumlahMakanan] = useState(0);
  const [keterangan, setKeterangan] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fungsi untuk menambah jumlah makanan
  const handleIncrease = () => setJumlahMakanan((prev) => prev + 1);

  // Fungsi untuk mengurangi jumlah makanan
  const handleDecrease = () =>
    setJumlahMakanan((prev) => (prev > 0 ? prev - 1 : 0));

  // Fungsi untuk mengirim data ke server
  const handleSubmit = async () => {
    if (
      !waktu ||
      !koordinat ||
      !namaPencari ||
      !nomorPencari ||
      !namaKegiatan ||
      !namaTempat
    ) {
      Alert.alert("Error", "Semua kolom harus diisi!");
      return;
    }

    setLoading(true);

    try {
      // Ambil token dari AsyncStorage
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setLoading(false);
        Alert.alert("Error", "Anda harus login terlebih dahulu!");
        return;
      }

      const response = await fetch("http://172.20.10.4:8000/food/need", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Tambahkan token ke header
        },
        body: JSON.stringify({
          waktu,
          koordinat,
          nama_pencari: namaPencari,
          nomor_pencari: nomorPencari,
          nama_kegiatan: namaKegiatan,
          nama_tempat: namaTempat,
          jumlah_makanan: jumlahMakanan,
          keterangan,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert("Sukses", "Data berhasil dikirim!");
        router.replace("/home"); // Navigasi ke home setelah sukses
      } else if (response.status === 401) {
        Alert.alert("Unauthorized", "Anda harus login kembali.");
      } else {
        Alert.alert("Gagal", data.detail || "Gagal menambahkan data.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Gagal menghubungkan ke server.");
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || waktu;
    setShowDatePicker(Platform.OS === "ios" ? true : false); // Keep picker open for iOS
    setWaktu(currentDate); // Update the state with selected date
  };

  return (
    <ScrollView style={styles.container}>
      {/* Waktu Pembagian */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Waktu Pembagian</Text>

        <DateTimePicker
          testID="dateTimePicker"
          value={waktu}
          mode="datetime" // Mengatur mode menjadi tanggal dan waktu
          is24Hour={true} // Menggunakan format 24 jam
          display="default" // Menampilkan default DatePicker
          onChange={onChange}
          timeZoneOffsetInMinutes={420}
        />
      </View>

      {/* Koordinat Input Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Koordinat</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan koordinat"
          placeholderTextColor="gray"
          value={koordinat}
          onChangeText={setKoordinat}
        />
      </View>

      {/* Map Component */}
      <View style={styles.mapContainer}>
        <MapComponent
          onMapClick={(lat, lng) => {
            const formattedCoordinate = `${lat}, ${lng}`;
            setKoordinat(formattedCoordinate);
          }}
        />
      </View>

      {/* Nama Pencari Donatur Makanan */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nama Pencari Donatur Makanan</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama pencari"
          placeholderTextColor="gray"
          value={namaPencari}
          onChangeText={setNamaPencari}
        />
      </View>

      {/* Nomor Pencari Donatur Makanan */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nomor Pencari Donatur Makanan</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nomor pencari"
          placeholderTextColor="gray"
          keyboardType="phone-pad"
          value={nomorPencari}
          onChangeText={setNomorPencari}
        />
      </View>

      {/* Nama Kegiatan */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nama Kegiatan/Acara</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama kegiatan"
          placeholderTextColor="gray"
          value={namaKegiatan}
          onChangeText={setNamaKegiatan}
        />
      </View>

      {/* Nama Tempat */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nama Tempat</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama tempat"
          placeholderTextColor="gray"
          value={namaTempat}
          onChangeText={setNamaTempat}
        />
      </View>

      {/* Jumlah Makanan */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Jumlah Makanan</Text>
        <View style={styles.jumlahContainer}>
          <TouchableOpacity onPress={handleDecrease}>
            <MaterialIcons name="remove" size={24} color="#D32F2F" />
          </TouchableOpacity>
          <Text style={styles.jumlahText}>{jumlahMakanan}</Text>
          <TouchableOpacity onPress={handleIncrease}>
            <MaterialIcons name="add" size={24} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Keterangan */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Keterangan</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Masukkan keterangan"
          placeholderTextColor="gray"
          value={keterangan}
          onChangeText={setKeterangan}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Tambahkan</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6f7",
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  mapContainer: {
    height: 300,
    marginBottom: 20,
    backgroundColor: "#ddd",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  jumlahContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  jumlahText: {
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#F9A826",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 60,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
