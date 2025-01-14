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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  async function handleRegister() {
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Lozinke se ne podudaraju!");
      toast({
        title: "Greška prilikom registracije",
        message: "Lozinke se ne podudaraju!",
      });
      console.error("Error signing up: Lozinke se ne podudaraju!");
    } else {
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
    }

    setLoading(false);
  }

  return (
    <View className="flex-1 gap-8 bg-background p-8">
      <Text className="text-center text-2xl font-bold text-foreground">
        Registrujte se
      </Text>
      <Input
        label="Email"
        placeholder="email@address.com"
        leftIcon={({ size, color }) => (
          <Ionicons
            name="mail"
            size={size}
            color={color}
          />
        )}
        onChangeText={text => setEmail(text)}
        value={email}
      />
      <Input
        label="Lozinka"
        placeholder="Lozinka"
        leftIcon={({ size, color }) => (
          <Ionicons
            name="key"
            size={size}
            color={color}
          />
        )}
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <Input
        label="PotvrdiLozinku"
        placeholder="Potvrdi lozinku"
        leftIcon={({ size, color }) => (
          <Ionicons
            name="key"
            size={size}
            color={color}
          />
        )}
        onChangeText={text => setConfirmPassword(text)}
        value={confirmPassword}
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
