import { Redirect, SplashScreen, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@/lib/context/user-provider";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function AuthLayout() {
  const { user } = useUser();

  useEffect(() => {
    if (user.loaded) {
      SplashScreen.hideAsync();
    }
  }, [user]);

  if (!user.loaded) {
    return null;
  }

  if (user.data !== null) {
    return <Redirect href="/" />;
  } else {
    return (
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="login"
          options={{
            title: "Prijava",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="log-in"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="register"
          options={{
            title: "Registracija",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-add"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>
    );
  }
}
