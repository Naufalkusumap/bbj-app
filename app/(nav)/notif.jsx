import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView, // For making content scrollable
  ActivityIndicator, // For loading spinner
} from "react-native";

const FoodListScreen = () => {
  const [foodData, setFoodData] = useState([]); // State to store fetched data
  const [selectedItem, setSelectedItem] = useState(null); // State to track the selected item
  const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state

  useEffect(() => {
    // Fetch data from the API
    const fetchFoodData = async () => {
      try {
        const response = await fetch("https://mobile-be.berbagibitesjogja.com/announcements/");
        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }
        const data = await response.json();
        setFoodData(data); // Store the data in state
      } catch (err) {
        setError(err.message); // Set error state
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchFoodData(); // Call the fetch function when the component mounts
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        setSelectedItem(item); // Set the selected item
        setIsModalVisible(true); // Show the modal
      }}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text
          style={styles.description}
          numberOfLines={2} // Limit description to 2 lines and add ellipsis if needed
        >
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const closeModal = () => {
    setIsModalVisible(false); // Hide the modal
    setSelectedItem(null); // Reset selected item
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={foodData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {/* Modal to show full details */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>✖</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
                <ScrollView style={styles.modalDescriptionContainer}>
                  <Text style={styles.modalDescription}>
                    {selectedItem?.description}
                  </Text>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#e5e6eb",
    marginBottom: 15, // Increased margin for better spacing
    borderRadius: 10, // Rounded corners
    padding: 15, // Increased padding for larger container
    alignItems: "center",
  },
  textContainer: {
    // marginLeft: 10,
    // marginRight: 10,
  },
  title: {
    fontSize: 18, // Increased font size for better readability
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "justify",
    marginTop: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay background
  },
  modalContainer: {
    width: "85%", // Increased width for better presentation
    padding: 25,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalDescriptionContainer: {
    maxHeight: "70%", // Limit the size of description to avoid overflow
  },
  modalDescription: {
    fontSize: 16,
    color: "#555",
    textAlign: "justify",
    margin: 5,
    paddingVertical: 10,
    textAlignVertical: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#D83F31", // Red background for the button
    borderRadius: 50, // Makes the button circular
    width: 40, // Width of the button
    height: 40, // Height of the button (same as width to make it circular)
    justifyContent: "center", // Center the content inside the button
    alignItems: "center", // Center the content inside the button
    padding: 0, // Remove extra padding to make it a perfect circle
  },
  closeButtonText: {
    fontSize: 18,
    color: "#ffff",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default FoodListScreen;
