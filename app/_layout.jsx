import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function RootLayout() {
  const router = useRouter(); // Untuk navigasi balik
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerShown: false,
      }}
    >
      {/* Login Screen - Hide Header */}
      <Stack.Screen name="login" options={{ headerShown: false }} />

      {/* Signup Screen - Show Back Button */}
      <Stack.Screen
        name="signup"
        options={{
          title: "Signup",
          headerBackTitleVisible: false, // Hide back text
        }}
      />
      <Stack.Screen
        name="addFood"
        options={{
          title: "Poin Pembagian Makanan",
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitleStyle: { color: "#D32F2F" },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            >
              <MaterialIcons name="arrow-back" size={24} color="#D32F2F" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="findFood"
        options={{
          title: "Poin Cari Donatur Makanan",
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitleStyle: { color: "#D32F2F" },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            >
              <MaterialIcons name="arrow-back" size={24} color="#D32F2F" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
