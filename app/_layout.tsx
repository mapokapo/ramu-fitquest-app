import "expo-dev-client";
import { Slot } from "expo-router";

import "../global.css";
import { UserProvider } from "@/lib/context/user-provider";
import { Toaster } from "burnt/web";
import { SettingsProvider, useSettings } from "@/lib/context/settings-provider";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { reactNavigationThemes, themes } from "@/lib/const/color-theme";
import { ThemeProvider } from "@react-navigation/native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <SettingsProvider>
      <SettingsLoader />
    </SettingsProvider>
  );
}

function SettingsLoader() {
  const { settings } = useSettings();
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    if (settings.loaded) {
      SplashScreen.hide();

      setColorScheme(settings.data.darkMode ? "dark" : "light");
    }
  }, [setColorScheme, settings]);

  if (!settings.loaded) {
    return null;
  }

  console.log(themes[colorScheme ?? "light"]);

  return (
    <View
      className="flex-1"
      style={themes[colorScheme ?? "light"]}>
      <ThemeProvider value={reactNavigationThemes(colorScheme === "dark")}>
        <UserProvider>
          <Toaster />
          <Slot />
        </UserProvider>
      </ThemeProvider>
    </View>
  );
}
