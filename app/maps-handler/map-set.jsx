// MapSet.jsx
import React, { useEffect } from "react";

const MapSet = () => {
  // const MapSet = ({ onMapClick }) => {
  // useEffect(() => {
  //   // Listen for messages from the iframe
  //   const handleMessage = (event) => {
  //     // Verify the origin for security (adjust as needed)
  //     if (event.origin.includes("map-view-bagi-makan-app.vercel.app")) {
  //       const { lat, lng } = event.data;
  //       if (lat && lng && onMapClick) {
  //         onMapClick(lat, lng);
  //       }
  //     }
  //   };

  //   window.addEventListener("message", handleMessage);

  //   // Clean up the event listener
  //   return () => {
  //     window.removeEventListener("message", handleMessage);
  //   };
  // }, [onMapClick]);

  return (
    <iframe
      title="Leaflet Map"
      src="https://map-view-bagi-makan-app.vercel.app/map-set"
      // source={require("../../assets/leafletMap.html")}
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  );
};

export default MapSet;
