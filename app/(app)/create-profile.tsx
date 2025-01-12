import { useState } from "react";
import { Text, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { useAppUser } from "@/lib/context/user-provider";
import { mapError } from "@/lib/utils";
import { toast } from "burnt";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function CreateProfile() {
  const user = useAppUser();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  async function handleCreateProfile() {
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .insert({ id: user.id, name, points: 0 });

    if (error) {
      const message = mapError(error);
      setError(message);
      toast({
        title: "Greška prilikom kreiranja profila",
        message: message,
      });
      console.error("Error creating profile:", error);
    }

    setLoading(false);
  }

  return (
    <View className="flex-1 gap-8 bg-background p-8">
      <Text className="text-center text-2xl font-bold text-foreground">
        Stvorite svoj profil
      </Text>
      <Input
        label="Ime"
        placeholder="Unesite ime..."
        leftIcon={({ size, color }) => (
          <Ionicons
            name="person"
            size={size}
            color={color}
          />
        )}
        onChangeText={text => setName(text)}
        value={name}
        autoCapitalize="words"
      />
      {error !== null && <Text className="text-destructive">{error}</Text>}
      <Button
        title="Kreiraj profil"
        disabled={loading}
        onPress={() => handleCreateProfile()}
      />
      <Button
        title="Odjavi se"
        onPress={() => {
          supabase.auth.signOut();
        }}
      />
    </View>
  );
}
