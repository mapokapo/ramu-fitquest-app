import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { supabase } from "@/lib/supabase";
import { toast } from "burnt";
import { ProfilePicture } from "@/components/profile-picture";
import { mapError } from "@/lib/utils";
import Button from "@/components/ui/button";
import AsyncValue from "@/lib/types/AsyncValue";

export default function OdabraniProfil() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const profileId = Array.isArray(id) ? id[0] : id;
  interface Profile {
    created_at: string;
    id: string;
    name: string;
    points: number;
    profile_picture_url: string | null;
  }
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
            .select("*")
            .eq("id", profileId)
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

        setProfile(data);
      } catch (error) {
        toast({
          title: "Neočekivana greška",
          message: (error as Error).message,
        });
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPosition = async (userId: string) => {
        try {
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
  
          setUserPosition(data);
        } catch (error) {
          console.error("Unexpected error fetching position:", error);
        }
      };

    fetchProfile();
    fetchUserPosition(profileId);
  }, [id]);

  

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-foreground">Učitavanje profila...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-foreground">Profil nije pronađen.</Text>
        <Button title="Nazad" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center gap-2 bg-background p-8">
        <Text className="text-center text-2xl font-bold text-foreground">
        Profil korisnika: {profile.name}
        <br/><br/><br/>
        </Text>
        <ProfilePicture profilePictureUrl={profile.profile_picture_url} />
        <Text className="text-xl font-bold text-foreground">{profile.name}</Text>
        <Text className="text-muted-foregroundđ">ID:</Text>
        <Text className="text-muted-foregroundđ">{profile.id}<br/><br/></Text>
        <Text className="text-foreground">Osvojeni bodovi: {profile.points}</Text>

        {userPosition !== null && (
        <Text className="text-foreground">Pozicija na ljestvici: {userPosition}</Text>
        )}

        <Button title="Nazad" onPress={() => router.back()} />
    </View>
  );
}
