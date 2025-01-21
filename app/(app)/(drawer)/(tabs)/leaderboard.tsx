import LeaderboardItem from "@/components/leaderboard-item";
import Button from "@/components/ui/button";
import { useAppProfile } from "@/lib/context/profile-provider";
import { supabase } from "@/lib/supabase";
import AsyncValue from "@/lib/types/AsyncValue";
import { Tables } from "@/lib/types/SupabaseDatabaseTypes";
import { insertAt, mapError } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { toast } from "burnt";
import { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";
import { Link } from "expo-router";

export default function Leaderboard() {
  const profile = useAppProfile();
  const [leaderboard, setLeaderboard] = useState<
    AsyncValue<Tables<"profiles">[]>
  >({
    loaded: false,
  });
  const [userPosition, setUserPosition] = useState<AsyncValue<number>>({
    loaded: false,
  });

  const fetchLeaderboard = async (profileId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("points", { ascending: false })
      .limit(50);

    if (error) {
      const message = mapError(error);
      toast({
        title: "Greška pri dohvaćanju ljestvice",
        message: message,
      });
      console.error("Error fetching leaderboard:", error);
      return;
    }

    setLeaderboard({
      loaded: true,
      data: data.filter(u => u.id !== profileId),
    });
  };

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
    fetchLeaderboard(profile.id).then(() => fetchUserPosition(profile.id));
  }, [profile]);

  return (
    <View className="flex-1 bg-background p-8">
      {leaderboard.loaded ? (
        <View className="flex-1">
          <View className="mb-4 justify-between rounded bg-muted p-4">
            <Text className="text-lg font-bold text-foreground">
              Vaši ukupni bodovi: {profile.points}
            </Text>
            {userPosition.loaded && (
              <Text className="text-lg font-bold text-foreground">
                Vaša pozicija: {userPosition.data}
              </Text>
            )}
          </View>

          <Button
            title="Osvježi"
            onPress={() => {
              setLeaderboard({ loaded: false });
              fetchLeaderboard(profile.id);
              fetchUserPosition(profile.id);
            }}
          />

          <FlatList
            data={
              userPosition.loaded
                ? insertAt(leaderboard.data, profile, userPosition.data - 1)
                : leaderboard.data
            }
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => (
              <Link
                href={`/view-profile/${item.id}`}
                className="w-full">
                <LeaderboardItem
                  profile={item}
                  currentUser={item.id === profile.id}
                  index={index}
                />
              </Link>
            )}
          />
        </View>
      ) : (
        <Ionicons
          name="refresh"
          size={32}
          color="black"
        />
      )}
    </View>
  );
}
