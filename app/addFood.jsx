import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  Alert,
  Platform,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";

import MapSet from "./maps-handler/map-set";
import MapSetMobile from "./maps-handler/maps-set-mobile";

const AddScreen = () => {
  const router = useRouter();

  // Pilih komponen peta sesuai platform
  const MapComponent = Platform.OS === "web" ? MapSet : MapSetMobile;

  // State untuk menyimpan input dari pengguna
  const [waktu, setWaktu] = useState(new Date());
  const [show, setShow] = useState(false);
  const [koordinat, setKoordinat] = useState("");
  const [namaPembagi, setNamaPembagi] = useState("");
  const [nomorPembagi, setNomorPembagi] = useState("");
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [namaMakanan, setNamaMakanan] = useState("");
  const [jenisMakanan, setJenisMakanan] = useState("");
  const [tipeMakanan, setTipeMakanan] = useState("");
  const [bahanMakanan, setBahanMakanan] = useState("");
  const [modalJenisMakananVisible, setModalJenisMakananVisible] =
    useState(false);
  const [modalTipeMakananVisible, setModalTipeMakananVisible] = useState(false);
  const [modalBahanMakananVisible, setModalBahanMakananVisible] =
    useState(false);
  const [jumlahMakanan, setJumlahMakanan] = useState(0);
  const [keterangan, setKeterangan] = useState("");
  const [waktuKadaluwarsa, setWaktuKadaluwarsa] = useState(new Date());
  const [makananDiambil, setMakananDiambil] = useState("");
  const [showKadaluwarsaPicker, setShowKadaluwarsaPicker] = useState(false); // Mengontrol visibilitas DateTimePicker
  const [wadahMakanan, setWadahMakanan] = useState("");
  const [modalWadahMakananVisible, setModalWadahMakananVisible] =
    useState(false);
  const [waktuPick, setWaktuPick] = useState(new Date());

  // Image state
  const [imageUri, setImageUri] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showExpireDatePicker, setShowExpireDatePicker] = useState(false);

  // Get permission for camera and gallery
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Needed",
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    })();
  }, []);

  // Function to pick an image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Handle date picker
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setWaktu(formattedDate);
    }
  };

  // Handle expire date picker
  const onExpireDateChange = (event, selectedDate) => {
    setShowExpireDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setWaktuKadaluwarsa(formattedDate);
    }
  };

  // Daftar jenis makanan untuk dipilih
  const foodTypes = [
    { label: "Bahan Makanan (Mentah)", value: "Bahan Makanan" },
    { label: "Makanan Matang", value: "Makanan Matang" },
  ];

  const foodStyles = [
    { label: "Makanan Berat", value: "Makanan Berat" },
    { label: "Makanan Ringan", value: "Makanan Ringan" },
    { label: "Bahan Makanan", value: "Bahan Makanan" },
    { label: "Minuman", value: "Minuman" },
  ];

  const foodComponents = [
    { label: "Tepung", value: "Tepung" },
    { label: "Daging", value: "Daging" },
    { label: "Olahan Santan", value: "Olahan Santan" },
    { label: "Buah dan Sayuran", value: "Buah dan Sayuran" },
  ];

  const foodWadah = [
    { label: "Iya, terdapat wadah makanan", value: "Iya" },
    { label: "Tidak ada wadah makanan", value: "Tidak" },
  ];

  // Fungsi untuk menutup modal Jenis Makanan
  const closeModalJenisMakanan = () => {
    setModalJenisMakananVisible(false);
  };

  // Fungsi untuk menutup modal Tipe Makanan
  const closeModalTipeMakanan = () => {
    setModalTipeMakananVisible(false);
  };

  // Fungsi untuk menutup modal Tipe Makanan
  const closeModalBahanMakanan = () => {
    setModalBahanMakananVisible(false);
  };

  // Fungsi untuk menutup modal Tipe Makanan
  const closeModalWadahMakanan = () => {
    setModalWadahMakananVisible(false);
  };

  // Fungsi untuk memilih jenis makanan
  const handleSelectFoodTypes = (value) => {
    setJenisMakanan(value);
    setModalJenisMakananVisible(false); // Tutup modal setelah memilih
  };

  // Fungsi untuk memilih tipe makanan
  const handleSelectFoodStyles = (value) => {
    setTipeMakanan(value);
    setModalTipeMakananVisible(false); // Tutup modal setelah memilih
  };

  // Fungsi untuk memilih bahan makanan
  const handleSelectFoodComponents = (value) => {
    setBahanMakanan(value);
    setModalBahanMakananVisible(false); // Tutup modal setelah memilih
  };

  // Fungsi untuk memilih bahan makanan
  const handleSelectFoodWadah = (value) => {
    setWadahMakanan(value);
    setModalWadahMakananVisible(false); // Tutup modal setelah memilih
  };

  // Fungsi untuk menambah jumlah makanan
  const handleIncrease = () => setJumlahMakanan(jumlahMakanan + 1);
  const handleDecrease = () => {
    if (jumlahMakanan > 0) setJumlahMakanan(jumlahMakanan - 1);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || waktu; // Jika tidak ada tanggal yang dipilih, gunakan tanggal yang sudah ada
    setShow(false);
    setWaktu(currentDate); // Menyimpan nilai waktu yang dipilih
  };

  // Fungsi untuk mengirim data ke server
  const handleSubmit = async () => {
    // Validation
    if (!waktu) {
      Alert.alert("Error", "Waktu harus diisi!");
      return;
    }
    if (!koordinat) {
      Alert.alert("Error", "Koordinat harus diisi!");
      return;
    }
    if (!namaPembagi) {
      Alert.alert("Error", "Nama pembagi harus diisi!");
      return;
    }
    if (!nomorPembagi) {
      Alert.alert("Error", "Nomor pembagi harus diisi!");
      return;
    }
    if (!namaKegiatan) {
      Alert.alert("Error", "Nama kegiatan harus diisi!");
      return;
    }
    if (!namaMakanan) {
      Alert.alert("Error", "Nama makanan harus diisi!");
      return;
    }
    if (!jenisMakanan) {
      Alert.alert("Error", "Jenis makanan harus diisi!");
      return;
    }
    if (!jumlahMakanan) {
      Alert.alert("Error", "Jumlah makanan harus diisi!");
      return;
    }
    if (!keterangan) {
      Alert.alert("Error", "Keterangan harus diisi!");
      return;
    }
    if (!waktuKadaluwarsa) {
      Alert.alert("Error", "Waktu kadaluwarsa harus diisi!");
      return;
    }
    if (!imageUri) {
      Alert.alert("Error", "Gambar makanan harus dipilih!");
      return;
    }

    console.log("Starting form submission...");
    setLoading(true);

    try {
      console.log("Getting token...");
      // Ambil token dari AsyncStorage
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        setLoading(false);
        Alert.alert("Error", "Anda harus login terlebih dahulu!");
        return;
      }
      console.log("Token retrieved successfully");

      // Create FormData object
      const formData = new FormData();

      // Add all text fields
      formData.append("waktu", waktu);
      formData.append("koordinat", koordinat);
      formData.append("nama_pembagi", namaPembagi);
      formData.append("nomor_pembagi", nomorPembagi);
      formData.append("nama_kegiatan", namaKegiatan);
      formData.append("nama_makanan", namaMakanan);
      formData.append("jenis_makanan", jenisMakanan);
      formData.append("jumlah_makanan", jumlahMakanan.toString());
      formData.append("keterangan", keterangan);
      formData.append("waktu_kadaluwarsa", waktuKadaluwarsa);

      // Add optional fields if they exist
      if (tipeMakanan) formData.append("tipe_makanan", tipeMakanan);
      if (wadahMakanan) formData.append("wadah_makanan", wadahMakanan);
      if (makananDiambil) formData.append("makanan_diambil", makananDiambil);

      // Add the image
      console.log("Preparing image for upload:", imageUri);

      // Extract filename from URI
      const imageUriParts = imageUri.split("/");
      const imageName = imageUriParts[imageUriParts.length - 1];

      // Determine mime type based on extension
      let imageType = "image/jpeg"; // Default
      if (imageName.toLowerCase().endsWith(".png")) {
        imageType = "image/png";
      } else if (
        imageName.toLowerCase().endsWith(".jpg") ||
        imageName.toLowerCase().endsWith(".jpeg")
      ) {
        imageType = "image/jpeg";
      }

      console.log(`Image name: ${imageName}, type: ${imageType}`);

      formData.append("image", {
        uri:
          Platform.OS === "android"
            ? imageUri
            : imageUri.replace("file://", ""),
        name: imageName,
        type: imageType,
      });

      console.log("FormData prepared, sending request...");

      const apiUrl = "http://172.20.10.4:8000/food/share";
      console.log("Sending request to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Response status:", response.status);

      // Try to parse response as JSON but handle if it's not JSON
      let data;
      const responseText = await response.text();
      try {
        data = JSON.parse(responseText);
        console.log("Response data:", data);
      } catch (e) {
        console.log("Response is not JSON:", responseText);
        data = { detail: "Received a non-JSON response" };
      }

      setLoading(false);

      if (response.ok) {
        console.log("Request successful!");
        Alert.alert("Sukses", "Data berhasil dikirim!");
        router.replace("/home"); // Navigasi ke home setelah sukses
      } else {
        console.log("Request failed with status:", response.status);
        Alert.alert(
          "Gagal",
          data.detail || `Error ${response.status}: Gagal menambahkan data.`
        );
      }
    } catch (error) {
      console.error("Exception occurred:", error);
      setLoading(false);
      Alert.alert("Error", `Gagal menghubungkan ke server: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Waktu Pembagian */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Waktu Pembagian</Text>

        <DateTimePicker
          testID="dateTimePicker"
          value={waktu}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onChange}
          // timeZoneOffsetInMinutes={420}
          // timeZone="Asia/Jakarta"
        />
      </View>

      {/* Koordinat Input Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Koordinat</Text>
        <TextInput
          style={styles.input}
          placeholder="Pilih koordinat"
          placeholderTextColor="gray"
          value={koordinat}
          editable={false}
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

      {/* Input lainnya */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nama Pembagi Makanan</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama pembagi makanan"
          placeholderTextColor="gray"
          value={namaPembagi}
          onChangeText={setNamaPembagi}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nomor Pembagi Makanan</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nomor pembagi makanan"
          placeholderTextColor="gray"
          keyboardType="phone-pad"
          value={nomorPembagi}
          onChangeText={setNomorPembagi}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nama Kegiatan</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama kegiatan"
          placeholderTextColor="gray"
          value={namaKegiatan}
          onChangeText={setNamaKegiatan}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nama Makanan</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama makanan"
          placeholderTextColor="gray"
          value={namaMakanan}
          onChangeText={setNamaMakanan}
        />
      </View>

      {/* Tombol untuk membuka modal dropdown Jenis Makanan */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Jenis Makanan</Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalJenisMakananVisible(true)} // Menampilkan modal untuk jenis makanan
        >
          <Text style={styles.pickerText}>
            {jenisMakanan ? jenisMakanan : "Pilih jenis makanan"}
          </Text>
        </TouchableOpacity>

        {/* Modal untuk memilih jenis makanan */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalJenisMakananVisible} // Hanya tampil jika modal jenis makanan aktif
          onRequestClose={closeModalJenisMakanan} // Menutup modal jika pengguna menekan back
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Pilih Jenis Makanan</Text>
              <FlatList
                data={foodTypes}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleSelectFoodTypes(item.value)} // Pilih jenis makanan
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModalJenisMakanan}
              >
                <Text style={styles.closeButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Tombol untuk membuka modal dropdown Tipe Makanan */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tipe Makanan</Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalTipeMakananVisible(true)} // Menampilkan modal untuk tipe makanan
        >
          <Text style={styles.pickerText}>
            {tipeMakanan ? tipeMakanan : "Pilih tipe makanan"}
          </Text>
        </TouchableOpacity>

        {/* Modal untuk memilih Tipe makanan */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalTipeMakananVisible} // Hanya tampil jika modal tipe makanan aktif
          onRequestClose={closeModalTipeMakanan} // Menutup modal jika pengguna menekan back
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Pilih Tipe Makanan</Text>
              <FlatList
                data={foodStyles}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleSelectFoodStyles(item.value)} // Pilih tipe makanan
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModalTipeMakanan}
              >
                <Text style={styles.closeButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Tombol untuk membuka modal dropdown Bahan Makanan */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bahan Makanan</Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalBahanMakananVisible(true)} // Menampilkan modal untuk tipe makanan
        >
          <Text style={styles.pickerText}>
            {bahanMakanan ? bahanMakanan : "Pilih bahan makanan"}
          </Text>
        </TouchableOpacity>

        {/* Modal untuk memilih Bahan makanan */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalBahanMakananVisible} // Hanya tampil jika modal tipe makanan aktif
          onRequestClose={closeModalBahanMakanan} // Menutup modal jika pengguna menekan back
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Pilih Bahan Makanan</Text>
              <FlatList
                data={foodComponents}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleSelectFoodComponents(item.value)} // Pilih tipe makanan
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModalBahanMakanan}
              >
                <Text style={styles.closeButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Waktu Kadaluwarsa</Text>
        <DateTimePicker
          testID="dateTimePickerKadaluwarsa"
          value={waktuKadaluwarsa}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      </View>

      {/* Tombol untuk membuka modal dropdown Wadah Makanan */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ketersediaan Wadah Makanan</Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalWadahMakananVisible(true)} // Menampilkan modal untuk jenis makanan
        >
          <Text style={styles.pickerText}>
            {wadahMakanan ? wadahMakanan : "Pilih Wadah makanan"}
          </Text>
        </TouchableOpacity>

        {/* Modal untuk memilih jenis makanan */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalWadahMakananVisible} // Hanya tampil jika modal jenis makanan aktif
          onRequestClose={closeModalWadahMakanan} // Menutup modal jika pengguna menekan back
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Ketersediaan Wadah Makanan</Text>
              <FlatList
                data={foodWadah}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleSelectFoodWadah(item.value)} // Pilih jenis makanan
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModalJenisMakanan}
              >
                <Text style={styles.closeButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Image picker */}
      <View style={styles.formGroup}>
        <Text style={styles.modalItemText}>Foto Makanan</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePickerText}>Pilih Gambar</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Makanan Sebaiknya diambil pada</Text>

        <DateTimePicker
          testID="dateTimePicker"
          value={waktuPick}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onChange}
          // timeZoneOffsetInMinutes={420}
          // timeZone="Asia/Jakarta"
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
  mapContainer: {
    height: 300,
    marginBottom: 20,
    backgroundColor: "#ddd",
  },
  inputContainer: {
    marginBottom: 20,
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
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  pickerText: {
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background for modal
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#F9A826",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePicker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  imagePickerText: {
    color: "#666",
  },
  imagePreview: {
    width: "90%",
    height: "85%",
    borderRadius: 8,
  },
});
