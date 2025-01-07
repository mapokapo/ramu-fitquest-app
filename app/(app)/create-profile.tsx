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

  async function handleCreateProfile() {
    const { error } = await supabase
      .from("profiles")
      .insert({ id: user.id, name, points: 0 });

    if (error) {
      const message = mapError(error);
      toast({
        title: "Greška prilikom kreiranja profila",
        message: message,
      });
      console.error("Error creating profile:", error);
    }
  }

  return (
    <View className="flex-1 gap-8 bg-background p-8">
      <Text className="text-center text-2xl font-bold">
        Stvorite svoj profil
      </Text>

      <View className="flex-row items-end gap-4">
        <Ionicons
          className="mb-2"
          name="mail"
          size={24}
          color="black"
        />
        <Input
          className="flex-1"
          label="Ime"
          onChangeText={text => setName(text)}
          value={name}
          placeholder="Unesite ime..."
          autoCapitalize="words"
        />
      </View>
      <Button
        title="Kreiraj profil"
        onPress={() => handleCreateProfile()}
      />
    </View>
  );
}
