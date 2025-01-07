import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function AppTabsLayout() {
  return (
    <Tabs>
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
    </Tabs>
  );
}
