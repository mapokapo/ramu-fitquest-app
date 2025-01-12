import LeaderboardItem from "@/components/leaderboard-item";
import { useAppUser } from "@/lib/context/user-provider";
import { supabase } from "@/lib/supabase";
import AsyncValue from "@/lib/types/AsyncValue";
import { Tables } from "@/lib/types/SupabaseDatabaseTypes";
import { mapError } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { toast } from "burnt";
import { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";

export default function Leaderboard() {
  const user = useAppUser();
  const [leaderboard, setLeaderboard] = useState<
    AsyncValue<Tables<"profiles">[]>
  >({
    loaded: false,
  });

  useEffect(() => {
    async function fetchLeaderboard() {
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
    }

    fetchLeaderboard();
  }, [user]);

  return (
    <View className="flex-1 bg-background p-8">
      {leaderboard.loaded ? (
        <View className="flex-1">
          <View className="mb-4 rounded bg-gray-200 p-4">
            <Text className="text-lg font-bold">
              Vaši ukupni bodovi:{" "}
              {leaderboard.data.find(u => u.id === user.id)?.points ?? 0}
            </Text>
          </View>

          <FlatList
            data={leaderboard.data}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item, index }) => (
              <LeaderboardItem
                profile={item}
                currentUser={user}
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
