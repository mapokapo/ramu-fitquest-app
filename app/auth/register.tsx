import { useState } from "react";
import { Text, View } from "react-native";
import { supabase } from "../../lib/supabase";
import { mapError } from "@/lib/utils";
import { toast } from "burnt";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Ionicons } from "@expo/vector-icons";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  async function handleRegister() {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      const message = mapError(error);
      setError(message);
      toast({
        title: "Greška prilikom registracije",
        message: message,
      });
      console.error("Error signing up:", error);
    }

    setLoading(false);
  }

  return (
    <View className="flex-1 gap-8 bg-background p-8">
      <Text className="text-center text-2xl font-bold">Registrujte se</Text>
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
        title="Registruj se"
        disabled={loading}
        onPress={() => handleRegister()}
      />
    </View>
  );
}
