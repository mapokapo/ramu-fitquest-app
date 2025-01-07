import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const isLoggedIn = false;

export default function AuthLayout() {
  if (isLoggedIn) {
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
