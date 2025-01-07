import { useState } from "react";
import { Text, View } from "react-native";
import { supabase } from "../../lib/supabase";
import { mapError } from "@/lib/utils";
import { toast } from "burnt";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const message = mapError(error);
      toast({
        title: "Greška prilikom prijave",
        message: message,
      });
      console.error("Error logging in:", error);
    }

    setLoading(false);
  }

  return (
    <View className="flex-1 gap-8 bg-background p-8">
      <Text className="text-center text-2xl font-bold">Prijavite se</Text>
      <View className="flex-row items-end gap-4">
        <Ionicons
          className="mb-2"
          name="mail"
          size={24}
          color="black"
        />
        <Input
          className="flex-1"
          label="Email"
          onChangeText={text => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View className="flex-row items-end gap-4">
        <Ionicons
          className="mb-2"
          name="key"
          size={24}
          color="black"
        />
        <Input
          className="flex-1"
          label="Lozinka"
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Lozinka"
          autoCapitalize={"none"}
        />
      </View>
      <Button
        title="Prijavi se"
        disabled={loading}
        onPress={() => handleLogin()}
      />
    </View>
  );
}
