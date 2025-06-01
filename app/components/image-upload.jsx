import React, { useState } from "react";
import { View, Button, Image, Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

const UploadPhoto = ({ onImageSelected }) => {
  const [image, setImage] = useState(null);

  // Fungsi untuk meminta izin dan memilih gambar
  const pickImage = async () => {
    // Meminta izin akses galeri pada iPhone
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need permission to access your gallery"
      );
      return;
    }

    // Membuka galeri foto di iPhone untuk memilih gambar
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Cek apakah gambar dipilih
    if (!result.canceled) {
      const selectedImage = result.assets
        ? result.assets[0]
        : { uri: result.uri };
      setImage(selectedImage.uri);
      onImageSelected(selectedImage);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 18,
      }}
    >
      <Button title="Tambahkan Foto" onPress={pickImage} />
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 200, marginTop: 20 }}
        />
      )}
    </View>
  );
};

export default UploadPhoto;
