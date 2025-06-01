import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const FoodListScreen = () => {
  const [foodData, setFoodData] = useState([]); // Untuk menyimpan data makanan
  const [loading, setLoading] = useState(true); // Untuk memonitor status loading

  // Mengambil data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://mobile-be.berbagibitesjogja.com/food/share");
        const data = await response.json();
        setFoodData(data); // Menyimpan data yang diterima dari API
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Menandakan proses selesai
      }
    };

    fetchData();
  }, []);

  // Fungsi untuk merender setiap item dalam FlatList
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={styles.iconContainer}>
        <FontAwesome6 name="clipboard-list" size={24} color="white" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.nama_kegiatan}</Text>
        <Text style={styles.description}>
          {item.nama_makanan} - {item.jenis_makanan}
        </Text>
        <Text style={styles.details}>
          Pembagi: {item.nama_pembagi} - {item.jumlah_makanan} porsi
        </Text>
        <Text style={styles.details}>Waktu: {item.waktu}</Text>
        <Text style={styles.details}>
          Kedaluwarsa: {item.waktu_kadaluwarsa}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ffab00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={foodData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 30,
    paddingHorizontal: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#ffab00", // Icon background color
    borderRadius: 20, // Circular icon container
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15, // Space between icon and text
  },
  textContainer: {
    flex: 1, // Ensures the text takes the remaining space
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4, // Adds space between title and description
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  details: {
    fontSize: 12,
    color: "#888",
  },
});

export default FoodListScreen;
