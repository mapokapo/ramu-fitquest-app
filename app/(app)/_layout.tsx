import { Redirect, Slot, Stack, usePathname } from "expo-router";

const isLoggedIn = false;
const hasProfile = true;

export default function AppLayout() {
  const pathname = usePathname();

  if (isLoggedIn) {
    if (!hasProfile && pathname !== "/create-profile") {
      return <Redirect href="/create-profile" />;
    } else if (hasProfile && pathname === "/create-profile") {
      return <Slot />;
    }

    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="create-profile"
          options={{
            headerShown: true,
            title: "Create Profile",
          }}
        />
      </Stack>
    );
  } else {
    return <Redirect href="/auth" />;
  }
}
