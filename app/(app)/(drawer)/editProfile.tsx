import { useState } from "react";
import { Text, View, Image } from "react-native";
import { supabase } from "@/lib/supabase";
import { mapError } from "@/lib/utils";
import { toast } from "burnt";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useAppProfile } from "@/lib/context/profile-provider";

export default function CreateProfile() {
  const profile = useAppProfile();
  const [imageUrl, setImageUrl] = useState(profile.profile_picture_url);
  const [name, setName] = useState(profile.name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  async function handleUpdateProfile() {
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ name: name, profile_picture_url: imageUrl })
      .eq("id", profile.id);

    if (error) {
      const message = mapError(error);
      setError(message);
      toast({
        title: "Greška prilikom promjene profila",
        message: message,
      });
      console.error("Error updating profile:", error);
    }

    setLoading(false);
  }

  const handleChangePhoto = () => {
    setImageUrl(prompt("Unesite novi url slike: "));
  };

  return (
    <View className="flex-1 gap-4 bg-background p-8">
      <Text className="text-center text-2xl font-bold text-foreground">
        Uredite profil
      </Text>
      <View className="items-center">
        <Image
          className="h-32 w-32 rounded-full"
          source={{
            uri: imageUrl ?? "",
          }}
          defaultSource={{
            uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          }}
        />
        <Text
          className="text-foreground"
          onPress={handleChangePhoto}>
          Promjeni sliku
        </Text>
      </View>
      <Input
        label="Ime"
        placeholder="Unesite ime..."
        value={name}
        leftIcon={({ size, color }) => (
          <Ionicons
            name="person"
            size={size}
            color={color}
          />
        )}
        onChangeText={text => setName(text)}
        autoCapitalize="words"
      />
      {error !== null && <Text className="text-destructive">{error}</Text>}
      <Button
        title="Potvrdi izmjene"
        disabled={loading}
        onPress={() => handleUpdateProfile()}
      />
    </View>
  );
}
