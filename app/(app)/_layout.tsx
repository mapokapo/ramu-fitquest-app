import { ProfileProvider, useProfile } from "@/lib/context/profile-provider";
import { useUser } from "@/lib/context/user-provider";
import { Redirect, Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const { user } = useUser();

  if (!user.loaded) {
    return null;
  }

  if (user.data !== null) {
    return (
      <ProfileProvider user={user.data}>
        <ProfileLoader />
      </ProfileProvider>
    );
  } else {
    return <Redirect href="/auth" />;
  }
}

function ProfileLoader() {
  const { profile } = useProfile();
  const pathname = usePathname();

  useEffect(() => {
    if (profile.loaded) {
      SplashScreen.hide();
    }
  }, [profile]);

  if (profile.loaded) {
    if (profile.data === null && pathname !== "/create-profile") {
      return <Redirect href="/create-profile" />;
    } else if (profile.data !== null && pathname === "/create-profile") {
      return <Redirect href="/" />;
    }
  } else {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create-profile" />
      <Stack.Screen
        name="(drawer)"
        redirect={profile.loaded && profile.data === null}
      />
    </Stack>
  );
}
