import "expo-dev-client";
import { Slot } from "expo-router";

import "../global.css";
import { UserProvider } from "@/lib/context/user-provider";
import { Toaster } from "burnt/web";

export default function RootLayout() {
  return (
    <UserProvider>
      <Toaster />
      <Slot />
    </UserProvider>
  );
}
