import Button from "@/components/ui/button";
import { useAppProfile } from "@/lib/context/profile-provider";
import { supabase } from "@/lib/supabase";
import AsyncValue from "@/lib/types/AsyncValue";
import { Tables } from "@/lib/types/SupabaseDatabaseTypes";
import { mapError } from "@/lib/utils";
import { toast } from "burnt";
import { useAppUser } from "@/lib/context/user-provider";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Link } from "expo-router";
import { challengesTranslationMap } from "@/lib/const/challenges-translation-map";
import { ProfilePicture } from "@/components/profile-picture";

export default function Profile() {
  const user = useAppUser();
  const profile = useAppProfile();

  const [dailyChallenge, setDailyChallenge] = useState<
    AsyncValue<
      Tables<"daily_challenges"> & {
        challenge: Tables<"challenges">;
      }
    >
  >({
    loaded: false,
  });
  const [challengeProgress, setChallengeProgress] = useState<
    AsyncValue<Tables<"user_challenges">>
  >({
    loaded: false,
  });
  const [userPosition, setUserPosition] = useState<AsyncValue<number>>({
    loaded: false,
  });

  useEffect(() => {
    async function fetchDailyChallenge() {
      const { data, error } = await supabase
        .from("daily_challenges")
        .select(`*, challenge:challenge_id(*)`)
        .order("id", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        const message = mapError(error);
        toast({
          title: "Greška pri dohvaćanju dnevnog izazova",
          message: message,
        });
        console.error("Error fetching daily challenge:", error);
        return;
      }

      setDailyChallenge({ loaded: true, data });
    }

    fetchDailyChallenge();
  }, [user]);

  useEffect(() => {
    async function fetchDailyChallengeProgress(dailyChallengeId: number) {
      const { data, error } = await supabase
        .from("user_challenges")
        .select("*")
        .eq("user_id", user.id)
        .eq("daily_challenge_id", dailyChallengeId)
        .maybeSingle();

      if (error) {
        const message = mapError(error);
        toast({
          title:
            "Greška pri dohvaćanju vašeg napretka prema postignuću izazova",
          message: message,
        });
        console.error("Error fetching user challenge progress:", error);
        return;
      }

      if (data === null) {
        const { data: newData, error: newError } = await supabase
          .from("user_challenges")
          .insert({
            user_id: user.id,
            daily_challenge_id: dailyChallengeId,
            progress: 0,
          })
          .select()
          .single();

        if (newError) {
          const message = mapError(newError);
          toast({
            title: "Greška pri kreiranju vašeg napretka prema izazovu",
            message: message,
          });
          console.error("Error creating user challenge progress:", newError);
          return;
        }

        setChallengeProgress({ loaded: true, data: newData });
      } else {
        setChallengeProgress({ loaded: true, data });
      }
    }

    if (dailyChallenge.loaded) {
      fetchDailyChallengeProgress(dailyChallenge.data.id);
    }
  }, [dailyChallenge, user]);

  const fetchUserPosition = async (userId: string) => {
    const { data, error } = await supabase.rpc(
      "get_user_leaderboard_position",
      {
        user_id: userId,
      }
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

  useEffect(() => {
    fetchUserPosition(profile.id);
  }, [profile]);

  const handleDeleteAccount = async () => {
    try {
      await supabase.storage
        .from("avatars")
        .remove([`${profile.id}/profile_picture`]);
      await supabase.from("profiles").delete().eq("id", profile.id);
      await supabase.rpc("delete_your_account");
      await supabase.auth.signOut();
    } catch (error) {
      const message = mapError(error);
      toast({
        title: "Greška pri brisanju profila",
        message: message,
      });
      console.error("Error deleting account:", error);
    }
  };

  return (
    <ScrollView>
      <View className="flex-1 gap-2 bg-background p-8">
        <View className="flex-1 items-center bg-background p-4">
          <ProfilePicture profilePictureUrl={profile.profile_picture_url} />
          <Text className="text-xl font-bold text-foreground">
            {profile.name}
          </Text>
          <Text className="text-xs text-muted-foreground">{profile.id}</Text>
        </View>
        <Text className="text-foreground">Email: {user.email}</Text>
        <Text className="text-foreground">Vaši poeni: {profile.points}</Text>
        {userPosition.loaded && (
          <Text className="text-foreground">
            Pozicija u Leaderboardu: {userPosition.data}
          </Text>
        )}
        <Link
          href="/profile/edit"
          asChild>
          <Button title="Uredite profil" />
        </Link>

        <Button
          title="Odjavi se"
          onPress={() => {
            supabase.auth.signOut();
          }}
        />
        <Button
          title="Izbrisati profil?"
          onPress={handleDeleteAccount}
          variant="destructive"
        />
        <View className="flex-1 items-center gap-2 bg-background p-8">
          <Text className="text-xl font-bold text-foreground">
            Današnji izazov
          </Text>
          {dailyChallenge.loaded ? (
            <View>
              <Text className="mb-4 text-lg text-foreground">
                {challengesTranslationMap(
                  dailyChallenge.data.challenge.challenge_code,
                  dailyChallenge.data.units
                ) ?? "Nepoznati izazov"}
              </Text>
              {challengeProgress.loaded ? (
                <Text className="text-foreground">
                  Vaš napredak:{" "}
                  {Math.round(
                    (challengeProgress.data.progress /
                      dailyChallenge.data.units) *
                      100
                  )}
                  % završen
                </Text>
              ) : (
                <Text className="text-foreground">
                  Vaš napredak se učitava...
                </Text>
              )}
            </View>
          ) : (
            <Text className="text-foreground">
              Vaš današnji izazov se učitava...
            </Text>
          )}
          <Link
            href="/izazovi"
            asChild>
            <Button title="Više o izazovima..." />
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
