import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function AppTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        tabBarStyle: {
          borderColor: "transparent",
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="izazovi"
        options={{
          title: "Izazovi",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="battery-charging"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="trophy"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
