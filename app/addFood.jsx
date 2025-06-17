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
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";

import MapSet from "./maps-handler/map-set";
import MapSetMobile from "./maps-handler/maps-set-mobile";

const AddScreen = () => {
  const router = useRouter();

  // Pilih komponen peta sesuai platform
  const MapComponent = Platform.OS === "web" ? MapSet : MapSetMobile;

  // State untuk form data dengan date dan time terpisah
  const [formData, setFormData] = useState({
    // Waktu pembagian - terpisah
    waktuDate: new Date(),
    waktuTime: new Date(),
    
    koordinat: "",
    namaPembagi: "",
    nomorPembagi: "",
    namaKegiatan: "",
    namaMakanan: "",
    jenisMakanan: "",
    tipeMakanan: "",
    bahanMakanan: "",
    jumlahMakanan: 0,
    keterangan: "",
    
    // Waktu kadaluwarsa - terpisah
    waktuKadaluwarsaDate: new Date(),
    waktuKadaluwarsaTime: new Date(),
    
    makananDiambil: "",
    wadahMakanan: "",
    
    // Waktu pick - terpisah
    waktuPickDate: new Date(),
    waktuPickTime: new Date(),
  });

  // State untuk UI controls
  const [modals, setModals] = useState({
    jenisMakanan: false,
    tipeMakanan: false,
    bahanMakanan: false,
    wadahMakanan: false,
  });

  const [datePickers, setDatePickers] = useState({
    waktuDate: false,
    waktuTime: false,
    waktuKadaluwarsaDate: false,
    waktuKadaluwarsaTime: false,
    waktuPickDate: false,
    waktuPickTime: false,
  });

  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // Data options
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

  // Get permission for camera and gallery
  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Needed",
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    };
    getPermissions();
  }, []);

  // Generic function untuk update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Generic function untuk toggle modal
  const toggleModal = (modalName, isOpen) => {
    setModals(prev => ({ ...prev, [modalName]: isOpen }));
  };

  // Generic function untuk toggle date picker
  const toggleDatePicker = (pickerName, isOpen) => {
    setDatePickers(prev => ({ ...prev, [pickerName]: isOpen }));
  };

  // Function untuk handle date picker change
  const handleDateChange = (pickerType) => (event, selectedDate) => {
    // Tutup picker terlebih dahulu
    toggleDatePicker(pickerType, false);
    
    // Jika user tidak dismiss dan ada tanggal yang dipilih
    if (event?.type !== 'dismissed' && selectedDate) {
      updateFormData(pickerType, selectedDate);
    }
  };

  // Function untuk menggabungkan date dan time
  const combineDateTime = (dateValue, timeValue) => {
    if (!dateValue || !timeValue) return null;
    
    const combined = new Date(dateValue);
    combined.setHours(timeValue.getHours());
    combined.setMinutes(timeValue.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);
    
    return combined;
  };

  // Function untuk format tanggal untuk display
  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "Pilih tanggal";
    }
    
    try {
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.warn('Error formatting date:', error);
      return "Pilih tanggal";
    }
  };

  // Function untuk format waktu untuk display
  const formatTime = (time) => {
    if (!time || !(time instanceof Date) || isNaN(time.getTime())) {
      return "Pilih waktu";
    }
    
    try {
      return time.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.warn('Error formatting time:', error);
      return "Pilih waktu";
    }
  };

  // Function untuk pick image
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

  // Function untuk handle selection dari modal
  const handleModalSelection = (modalType, field, value) => {
    updateFormData(field, value);
    toggleModal(modalType, false);
  };

  // Function untuk increment/decrement jumlah makanan
  const handleQuantityChange = (type) => {
    if (type === "increase") {
      updateFormData("jumlahMakanan", formData.jumlahMakanan + 1);
    } else if (type === "decrease" && formData.jumlahMakanan > 0) {
      updateFormData("jumlahMakanan", formData.jumlahMakanan - 1);
    }
  };

  // Validation function
  const validateForm = () => {
    const requiredFields = [
      { field: "waktuDate", message: "Tanggal pembagian harus diisi!" },
      { field: "waktuTime", message: "Waktu pembagian harus diisi!" },
      { field: "koordinat", message: "Koordinat harus diisi!" },
      { field: "namaPembagi", message: "Nama pembagi harus diisi!" },
      { field: "nomorPembagi", message: "Nomor pembagi harus diisi!" },
      { field: "namaKegiatan", message: "Nama kegiatan harus diisi!" },
      { field: "namaMakanan", message: "Nama makanan harus diisi!" },
      { field: "jenisMakanan", message: "Jenis makanan harus diisi!" },
      { field: "jumlahMakanan", message: "Jumlah makanan harus diisi!" },
      { field: "keterangan", message: "Keterangan harus diisi!" },
      { field: "waktuKadaluwarsaDate", message: "Tanggal kadaluwarsa harus diisi!" },
      { field: "waktuKadaluwarsaTime", message: "Waktu kadaluwarsa harus diisi!" },
    ];

    for (const { field, message } of requiredFields) {
      const value = formData[field];
      if (!value || (field === "jumlahMakanan" && value <= 0)) {
        Alert.alert("Error", message);
        return false;
      }
    }

    if (!imageUri) {
      Alert.alert("Error", "Gambar makanan harus dipilih!");
      return false;
    }

    return true;
  };

  // Function untuk submit form
  const handleSubmit = async () => {
    if (!validateForm()) return;

    console.log("Starting form submission...");
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setLoading(false);
        Alert.alert("Error", "Anda harus login terlebih dahulu!");
        return;
      }

      // Gabungkan date dan time sebelum mengirim
      const waktuCombined = combineDateTime(formData.waktuDate, formData.waktuTime);
      const waktuKadaluwarsaCombined = combineDateTime(formData.waktuKadaluwarsaDate, formData.waktuKadaluwarsaTime);
      const waktuPickCombined = combineDateTime(formData.waktuPickDate, formData.waktuPickTime);

      const formDataToSend = new FormData();
      
      // Add combined datetime fields
      if (waktuCombined) {
        formDataToSend.append('waktu', waktuCombined.toISOString());
      }
      if (waktuKadaluwarsaCombined) {
        formDataToSend.append('waktuKadaluwarsa', waktuKadaluwarsaCombined.toISOString());
      }
      if (waktuPickCombined) {
        formDataToSend.append('waktuPick', waktuPickCombined.toISOString());
      }

      // Add other form fields (skip the separate date/time fields)
      const fieldsToSkip = [
        'waktuDate', 'waktuTime', 
        'waktuKadaluwarsaDate', 'waktuKadaluwarsaTime',
        'waktuPickDate', 'waktuPickTime'
      ];

      Object.entries(formData).forEach(([key, value]) => {
        if (!fieldsToSkip.includes(key) && value !== "" && value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      // Add image
      const imageUriParts = imageUri.split("/");
      const imageName = imageUriParts[imageUriParts.length - 1];
      const imageType = imageName.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";

      formDataToSend.append("image", {
        uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""),
        name: imageName,
        type: imageType,
      });

      const response = await fetch("https://mobile-be.berbagibitesjogja.com/food/share", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        data = { detail: "Received a non-JSON response" };
      }

      setLoading(false);

      if (response.ok) {
        Alert.alert("Sukses", "Data berhasil dikirim!");
        router.replace("/home");
      } else {
        Alert.alert("Gagal", data.detail || `Error ${response.status}: Gagal menambahkan data.`);
      }
    } catch (error) {
      console.error("Exception occurred:", error);
      setLoading(false);
      Alert.alert("Error", `Gagal menghubungkan ke server: ${error.message}`);
    }
  };

  // Component untuk render modal picker
  const renderModalPicker = (modalType, title, data, field) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modals[modalType]}
      onRequestClose={() => toggleModal(modalType, false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleModalSelection(modalType, field, item.value)}
              >
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => toggleModal(modalType, false)}
          >
            <Text style={styles.closeButtonText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Component untuk render date picker button
  const renderDatePickerButton = (pickerType, label, mode = "date") => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => toggleDatePicker(pickerType, true)}
      >
        <Text style={styles.pickerText}>
          {mode === "date" ? formatDate(formData[pickerType]) : formatTime(formData[pickerType])}
        </Text>
      </TouchableOpacity>
      {datePickers[pickerType] && Platform.OS !== 'web' && (
        <DateTimePicker
          testID={`dateTimePicker${pickerType}`}
          value={formData[pickerType] || new Date()}
          mode={mode}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange(pickerType)}
          maximumDate={mode === 'date' && (pickerType.includes('Kadaluwarsa') || pickerType.includes('Pick')) ? new Date(2030, 11, 31) : undefined}
          minimumDate={mode === 'date' && (pickerType.includes('Kadaluwarsa') || pickerType.includes('Pick')) ? new Date() : undefined}
        />
      )}
      {datePickers[pickerType] && Platform.OS === 'web' && (
        <input
          type={mode === "date" ? "date" : "time"}
          value={
            mode === "date" 
              ? formData[pickerType]?.toISOString().slice(0, 10) || ''
              : formData[pickerType]?.toTimeString().slice(0, 5) || ''
          }
          onChange={(e) => {
            let newDate;
            if (mode === "date") {
              newDate = new Date(e.target.value);
            } else {
              const [hours, minutes] = e.target.value.split(':');
              newDate = new Date();
              newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            }
            
            if (!isNaN(newDate.getTime())) {
              updateFormData(pickerType, newDate);
            }
            toggleDatePicker(pickerType, false);
          }}
          style={{
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#ccc',
            backgroundColor: '#fff',
            marginTop: 8,
          }}
        />
      )}
    </View>
  );

  // Component untuk render pasangan date dan time
  const renderDateTimePair = (baseName, label) => (
    <View style={styles.dateTimeContainer}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.dateTimeRow}>
        <View style={styles.dateTimeHalf}>
          {renderDatePickerButton(`${baseName}Date`, "Tanggal", "date")}
        </View>
        <View style={styles.dateTimeHalf}>
          {renderDatePickerButton(`${baseName}Time`, "Waktu", "time")}
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Date Time Pickers - Terpisah */}
      {renderDateTimePair("waktu", "Waktu Pembagian")}

      {/* Koordinat */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Koordinat</Text>
        <TextInput
          style={styles.input}
          placeholder="Pilih koordinat"
          placeholderTextColor="gray"
          value={formData.koordinat}
          editable={false}
        />
      </View>

      {/* Map Component */}
      <View style={styles.mapContainer}>
        <MapComponent
          onMapClick={(lat, lng) => {
            updateFormData("koordinat", `${lat}, ${lng}`);
          }}
        />
      </View>

      {/* Text Inputs */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nama Pembagi Makanan</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama pembagi makanan"
          placeholderTextColor="gray"
          value={formData.namaPembagi}
          onChangeText={(text) => updateFormData("namaPembagi", text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nomor Pembagi Makanan</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nomor pembagi makanan"
          placeholderTextColor="gray"
          keyboardType="phone-pad"
          value={formData.nomorPembagi}
          onChangeText={(text) => updateFormData("nomorPembagi", text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nama Kegiatan</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama kegiatan"
          placeholderTextColor="gray"
          value={formData.namaKegiatan}
          onChangeText={(text) => updateFormData("namaKegiatan", text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nama Makanan</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama makanan"
          placeholderTextColor="gray"
          value={formData.namaMakanan}
          onChangeText={(text) => updateFormData("namaMakanan", text)}
        />
      </View>

      {/* Modal Pickers */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Jenis Makanan</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => toggleModal("jenisMakanan", true)}
        >
          <Text style={styles.pickerText}>
            {formData.jenisMakanan || "Pilih jenis makanan"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tipe Makanan</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => toggleModal("tipeMakanan", true)}
        >
          <Text style={styles.pickerText}>
            {formData.tipeMakanan || "Pilih tipe makanan"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bahan Makanan</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => toggleModal("bahanMakanan", true)}
        >
          <Text style={styles.pickerText}>
            {formData.bahanMakanan || "Pilih bahan makanan"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Jumlah Makanan */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Jumlah Makanan</Text>
        <View style={styles.jumlahContainer}>
          <TouchableOpacity onPress={() => handleQuantityChange("decrease")}>
            <MaterialIcons name="remove" size={24} color="#D32F2F" />
          </TouchableOpacity>
          <Text style={styles.jumlahText}>{formData.jumlahMakanan}</Text>
          <TouchableOpacity onPress={() => handleQuantityChange("increase")}>
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
          value={formData.keterangan}
          onChangeText={(text) => updateFormData("keterangan", text)}
        />
      </View>

      {/* Date Time Pickers - Waktu Kadaluwarsa */}
      {renderDateTimePair("waktuKadaluwarsa", "Waktu Kadaluwarsa")}

      {/* Wadah Makanan */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ketersediaan Wadah Makanan</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => toggleModal("wadahMakanan", true)}
        >
          <Text style={styles.pickerText}>
            {formData.wadahMakanan || "Pilih wadah makanan"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image picker */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Foto Makanan</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePickerText}>Pilih Gambar</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Waktu Pick */}
      {renderDateTimePair("waktuPick", "Makanan Sebaiknya diambil pada")}

      {/* Modals */}
      {renderModalPicker("jenisMakanan", "Pilih Jenis Makanan", foodTypes, "jenisMakanan")}
      {renderModalPicker("tipeMakanan", "Pilih Tipe Makanan", foodStyles, "tipeMakanan")}
      {renderModalPicker("bahanMakanan", "Pilih Bahan Makanan", foodComponents, "bahanMakanan")}
      {renderModalPicker("wadahMakanan", "Ketersediaan Wadah Makanan", foodWadah, "wadahMakanan")}

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

// Tambahkan styles untuk komponen baru
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#D32F2F',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  pickerText: {
    color: '#333',
    fontSize: 16,
  },
  dateTimeContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeHalf: {
    flex: 0.48,
  },
  mapContainer: {
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  jumlahContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
  },
  jumlahText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#333',
  },
  imagePicker: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imagePickerText: {
    color: '#666',
    fontSize: 16,
  },
  imagePreview: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddScreen;