import "expo-dev-client";
import { Slot } from "expo-router";

import "../global.css";
import { UserProvider } from "@/lib/context/user-provider";

export default function RootLayout() {
  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}
