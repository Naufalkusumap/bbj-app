import React, { useRef, useState } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

const MapSetMobile = ({ onMapClick }) => {
  const webViewRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Fungsi untuk menangkap pesan dari WebView (koordinat dari peta)
  const handleMessage = (event) => {
    const location = JSON.parse(event.nativeEvent.data);
    console.log(location);
    setSelectedLocation(location);
    if (onMapClick) {
      onMapClick(location.lat, location.lng); // Kirim ke AddScreen
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={require("../../assets/leafletMap.html")}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default MapSetMobile;
