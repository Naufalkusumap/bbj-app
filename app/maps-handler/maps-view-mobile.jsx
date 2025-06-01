import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

const MyMapMobile = () => (
  <View style={styles.container}>
    <WebView
      source={{
        uri: "https://mobile-be.berbagibitesjogja.com/map-view",
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MyMapMobile;
