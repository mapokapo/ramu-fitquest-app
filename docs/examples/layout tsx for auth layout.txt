import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@/lib/context/user-provider";

export default function AuthLayout() {
  const { user } = useUser();

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
            title: "Log in",
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
            title: "Register",
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
