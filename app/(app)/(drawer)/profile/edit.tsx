import { useState } from "react";
import { Text, View, Image } from "react-native";
import { supabase, supabaseConfig } from "@/lib/supabase";
import { mapError } from "@/lib/utils";
import { toast } from "burnt";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useAppProfile } from "@/lib/context/profile-provider";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import { useRouter } from "expo-router";
import ProfilePicture from "@/components/ui/ProfilePicture";

export default function EditProfile() {
  const profile = useAppProfile();
  const router = useRouter();
  const [image, setImage] = useState<
    string | null | (ImagePicker.ImagePickerAsset & { base64: string })
  >(profile.profile_picture_url);
  const [name, setName] = useState(profile.name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleUpdateProfile = async () => {
    setLoading(true);

    let newImageUrl = null;
    if (image !== null && typeof image !== "string") {
      const { data, error: storageError } = await supabase.storage
        .from("avatars")
        .upload(`${profile.id}/profile_picture`, decode(image.base64), {
          contentType: image.mimeType,
          upsert: true,
        });

      if (storageError) {
        const message = mapError(storageError);
        setError(message);
        toast({
          title: "Greška prilikom promjene slike",
          message: message,
        });
        console.error("Error uploading image:", storageError);
        setLoading(false);
        return;
      }

      newImageUrl = `${supabaseConfig.supabaseUrl}/storage/v1/object/public/${data.fullPath}`;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        name: name,
        profile_picture_url: newImageUrl ?? undefined,
      })
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

    setHasChanges(false);

    router.back();
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (
      !result.canceled &&
      result.assets.length > 0 &&
      result.assets[0].base64 !== undefined &&
      result.assets[0].base64 !== null
    ) {
      setImage(
        result.assets[0] as ImagePicker.ImagePickerAsset & { base64: string }
      );
      setHasChanges(true);
    }
  };

  return (
    <View className="flex-1 gap-4 bg-background p-8">
      <Text className="text-center text-2xl font-bold text-foreground">
        Uredite profil
      </Text>
      <Button
        className="items-center"
        onPress={handlePickImage}>
        <ProfilePicture profile_picture_url={profile.profile_picture_url}/>
      </Button>
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
        onChangeText={text => {
          setName(text);
          setHasChanges(true);
        }}
        autoCapitalize="words"
      />
      {error !== null && <Text className="text-destructive">{error}</Text>}
      <Button
        title="Potvrdi izmjene"
        disabled={loading || !hasChanges}
        onPress={() => handleUpdateProfile()}
      />
    </View>
  );
}
