import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons"; // Import Feather icon correctly

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        headerBackTitleVisible: true,
        tabBarActiveTintColor: "#F9A826", // Active tab icon and label color
        tabBarInactiveTintColor: "gray", // Inactive tab icon and label color
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Beranda",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size || 24} color={color || "black"} />
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: "Daftar Pembagian Makanan",
          tabBarLabel: "Daftar", // You can keep the label if needed
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" size={size || 24} color={color || "black"} />
          ),
        }}
      />
      <Tabs.Screen
        name="notif"
        options={{
          title: "Informasi",
          tabBarLabel: "Informasi", // You can keep the label if needed
          tabBarIcon: ({ color, size }) => (
            <Feather name="bell" size={size || 24} color={color || "black"} />
          ),
        }}
      />
    </Tabs>
  );
}
