import { useState } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";
import { useAppUser } from "@/lib/context/user-provider";
import { mapError } from "@/lib/utils";
import { toast } from "burnt";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useAppProfile } from "@/lib/context/profile-provider";

export default function CreateProfile() {
  const user = useAppUser();
  const profile = useAppProfile();
  const [imageUrl, setImageUrl] = useState(profile.profile_picture_url);
  const [name, setName] = useState(profile.name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const styles = StyleSheet.create({
    profilePicture: {
      borderRadius: 50,
      height: 100,
      width: 100,
      backgroundColor: "#010101",
    },
    centerImage: {
      display: "flex",
      alignItems: "center",
    },
  });

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
      <View style={styles.centerImage}>
        <Image
          style={styles.profilePicture}
          source={{
            uri:
              profile.profile_picture_url ??
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
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
      <Input
        label="Ime"
        placeholder="Unesite ime..."
        value={user.email}
        leftIcon={({ size, color }) => (
          <Ionicons
            name="person"
            size={size}
            color={color}
          />
        )}
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
