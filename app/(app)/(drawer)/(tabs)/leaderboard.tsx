import LeaderboardItem from "@/components/leaderboard-item";
import Button from "@/components/ui/button";
import { useAppProfile } from "@/lib/context/profile-provider";
import { supabase } from "@/lib/supabase";
import AsyncValue from "@/lib/types/AsyncValue";
import { Tables } from "@/lib/types/SupabaseDatabaseTypes";
import { mapError } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { toast } from "burnt";
import { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";

export default function Leaderboard() {
  const profile = useAppProfile();
  const [leaderboard, setLeaderboard] = useState<
    AsyncValue<Tables<"profiles">[]>
  >({
    loaded: false,
  });

  const fetchLeaderboard = async () => {
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
      data,
    });
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    setLeaderboard(prev => {
      if (!prev.loaded) return prev;
      if (!prev.data.some(u => u.id === profile.id)) return prev;

      return {
        loaded: true,
        data: prev.data.map(u => (u.id === profile.id ? profile : u)),
      };
    });
  }, [profile]);

  return (
    <View className="flex-1 bg-background p-8">
      {leaderboard.loaded ? (
        <View className="flex-1">
          <View className="mb-4 rounded bg-gray-200 p-4">
            <Text className="text-lg font-bold">
              Vaši ukupni bodovi:{" "}
              {leaderboard.data.find(u => u.id === profile.id)?.points ?? 0}
            </Text>
          </View>

          <Button
            title="Osvježi"
            onPress={() => {
              setLeaderboard({ loaded: false });
              fetchLeaderboard();
            }}
          />

          <FlatList
            data={leaderboard.data}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item, index }) => (
              <LeaderboardItem
                profile={item}
                currentUser={item.id === profile.id}
                index={index}
              />
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
