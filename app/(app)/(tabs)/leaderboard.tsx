import Button from "@/components/ui/button";
import { useAppProfile } from "@/lib/context/profile-provider";
import { useAppUser } from "@/lib/context/user-provider";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";


export default function Leaderboard() {
  const profile = useAppProfile();
  const user = useAppUser();
  const [leaderboard, setLeaderboard] = useState<{ id: string; name: string; points: number }[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, points")
        .order("points", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Greška u dohvaćanju ljestvice:", error);
        return;
      }

      setLeaderboard(data);

      if (profile) {
        const rank = data.findIndex((u) => u.id === user.id) + 1;
        setUserRank(rank);
      }
    }

    fetchLeaderboard();
  }, [profile]);

  const renderItem = ({ item, index }: { item: { id: string; name: string; points: number }; index: number }) => (
    <View
      className={`flex-row justify-between py-2 px-4 border-b border-gray-200 ${
        item.id === user?.id ? "bg-gray-100" : ""
      }`}
    >
      <Text>{index + 1}. {item.name}</Text>
      <Text>{item.points} bodova</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-background p-8">
      {profile && (
        <View className="mb-4 p-4 bg-gray-200 rounded">
          <Text className="text-lg font-bold">Vaši bodovi: {profile.data.points}</Text>
          <Text className="text-sm">Vaša pozicija: {userRank || "Niste rankirani"}</Text>
        </View>
      )}

      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
