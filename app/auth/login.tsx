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
  const [error, setError] = useState<null | string>(null);

  async function handleLogin() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const message = mapError(error);
      setError(message);
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
      <Input
        label="Email"
        placeholder="email@address.com"
        leftIcon={
          <Ionicons
            name="mail"
            size={24}
            color="black"
          />
        }
        onChangeText={text => setEmail(text)}
        value={email}
        autoCapitalize="none"
      />
      <Input
        label="Lozinka"
        placeholder="Lozinka"
        leftIcon={
          <Ionicons
            name="key"
            size={24}
            color="black"
          />
        }
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry={true}
        autoCapitalize="none"
      />
      {error !== null && <Text className="text-destructive">{error}</Text>}
      <Button
        title="Prijavi se"
        disabled={loading}
        onPress={() => handleLogin()}
      />
    </View>
  );
}
