import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { supabase } from "@/lib/supabase";
import { toast } from "burnt";
import { ProfilePicture } from "@/components/profile-picture";
import { mapError } from "@/lib/utils";
import Button from "@/components/ui/button";
import AsyncValue from "@/lib/types/AsyncValue";
import { Tables } from "@/lib/types/SupabaseDatabaseTypes";

export default function OdabraniProfil() {
  const router = useRouter();
  const { id: profileId } = useLocalSearchParams<{ id: string }>();

  const [userPosition, setUserPosition] = useState<AsyncValue<number>>({
    loaded: false,
  });
  const [profile, setProfile] = useState<AsyncValue<Tables<"profiles"> | null>>(
    {
      loaded: false,
    }
  );

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .limit(1)
        .single();

      if (error) {
        const message = mapError(error);
        toast({
          title: "Greška pri dohvaćanju profila",
          message: message,
        });
        console.error("Error fetching profile:", error);
        return;
      }

      setProfile({
        loaded: true,
        data,
      });
    };

    const fetchUserPosition = async () => {
      const { data, error } = await supabase.rpc(
        "get_user_leaderboard_position",
        { user_id: profileId }
      );

      if (error) {
        const message = mapError(error);
        toast({
          title: "Greška pri dohvaćanju pozicije",
          message: message,
        });
        console.error("Error fetching user position:", error);
        return;
      }

      setUserPosition({
        loaded: true,
        data,
      });
    };

    fetchProfile();
    fetchUserPosition();
  }, [profileId]);

  if (!profile.loaded || !userPosition.loaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-foreground">Učitavanje profila...</Text>
      </View>
    );
  }

  if (profile.data === null) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-foreground">Profil nije pronađen.</Text>
        <Button
          title="Nazad"
          onPress={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center gap-2 bg-background p-8">
      <Text className="text-center text-2xl font-bold text-foreground">
        Profil korisnika: {profile.data.name}
      </Text>
      <ProfilePicture profilePictureUrl={profile.data.profile_picture_url} />
      <Text className="text-xl font-bold text-foreground">
        {profile.data.name}
      </Text>
      <Text className="text-muted-foreground">ID:</Text>
      <Text className="text-muted-foreground">
        {profile.data.id}
        <br />
        <br />
      </Text>
      <Text className="text-foreground">
        Osvojeni bodovi: {profile.data.points}
      </Text>

      <Text className="text-foreground">
        Pozicija na ljestvici: {userPosition.data}
      </Text>

      <Button
        title="Nazad"
        onPress={() => router.back()}
      />
    </View>
  );
}
