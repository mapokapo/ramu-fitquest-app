import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export default function AppDrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: "App",
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{ title: "Profile" }}
        />
        <Drawer.Screen
          name="settings"
          options={{ title: "Settings" }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
