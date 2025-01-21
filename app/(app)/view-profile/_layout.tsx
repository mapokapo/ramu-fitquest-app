import { Stack } from "expo-router";

export default function ViewProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="[id]"
        options={{
          title: "Profile",
        }}
      />
    </Stack>
  );
}
