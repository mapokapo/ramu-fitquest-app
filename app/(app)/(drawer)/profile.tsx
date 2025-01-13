import Button from "@/components/ui/button";
import { useAppProfile } from "@/lib/context/profile-provider";
import { supabase } from "@/lib/supabase";
import AsyncValue from "@/lib/types/AsyncValue";
import { Tables } from "@/lib/types/SupabaseDatabaseTypes";
import { mapError } from "@/lib/utils";
import { toast } from "burnt";
import { useAppUser } from "@/lib/context/user-provider";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

const challengesTranslationMap = (
  challengeCode: string,
  value: number
): string | null => {
  const map: Record<string, ((value: number) => string) | undefined> = {
    walk_steps: (steps: number) => `Pređite ${steps} koraka`,
    do_pushups: (pushups: number) => `Napravite ${pushups} sklekova`,
    stretch_mins: (mins: number) => `Odradite ${mins} minuta istezanja`,
    drink_water_mls: (mls: number) => `Popijte ${mls} ml vode`,
    plank_mins: (mins: number) => `Odradite plank ${mins} minuta`,
    read_pages: (pages: number) => `Pročitajte ${pages} stranica knjige`,
    do_situps: (situps: number) => `Napravite ${situps} trbušnjaka`,
    do_squats: (squats: number) => `Napravite ${squats} čučnjeva`,
    walk_kms: (kms: number) => `Pređite ${kms} kilometara`,
    do_yoga_mins: (mins: number) => `Odradite ${mins} minuta joge`,
  };

  const translation = map[challengeCode];

  if (!translation) {
    return null;
  }

  return translation(value);
};

export default function Profile() {
  const user = useAppUser();
  const profile = useAppProfile();
  const [place, setPlace] = useState(0);
  const router = useRouter();
  const [leaderboard, setLeaderboard] = 
    useState<AsyncValue<Tables<"profiles">[]>>({loaded: false,});
  
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

  const getPlace = () => {
    if(leaderboard.loaded){
      let i = 0;
      while(place == 0 && i < leaderboard.data.length){
        if(leaderboard.data[i].name == profile.name){
          setPlace(i+1);
          break;
        }else i++;
      }
    }
  }

  const toEditProfile = () => {
    router.replace('/editProfile')
  }

  const toIzazovi = () => {
    router.replace('/izazovi')
  }

  const styles = StyleSheet.create({
    profilePicture: {
      borderRadius: 50,
      height: 100,
      width: 100,
      backgroundColor: "#010101",
    },
    userID: {
      color: 'grey',
    },
    Container: {
      display: 'flex',
      alignItems: 'center',
    },
    Spacer: {
      height: 40,
    }
  });

  return (
    <View className="flex-1 gap-2 bg-background p-8" style={styles.Container}>
      <Image style={styles.profilePicture} source={{uri: profile.profile_picture_url ?? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}}/>
      <Text className="text-xl font-bold text-foreground">{profile.name}</Text>
      <Text style={styles.userID}>{profile.id}</Text>
      
      <Text className="text-foreground">Email: {user.email}</Text>
      <Text className="text-foreground">Vaši poeni: {profile.points}</Text>
      <Text className="text-foreground">Pozicija u Leaderboardu: 
      {leaderboard.loaded ? (getPlace() ?? ' ' + place) : ' ' + 0}
      </Text>
      <Button title="Uredite profil" onPress={toEditProfile}/>

      <div id='Spacer' style={styles.Spacer}></div>

      <Text className="text-xl font-bold text-foreground">Današnji izazov</Text>
      {dailyChallenge.loaded ? (
        <View>
          <Text className="mb-4 text-lg text-foreground">
            {challengesTranslationMap(
              dailyChallenge.data.challenge.challenge_code,
              dailyChallenge.data.units
            ) ?? "Nepoznati izazov"}
          </Text>
          {challengeProgress.loaded ? (
            <View>
              <Text className="text-foreground">
                Vaš napredak:{" "}
                {Math.round(
                  (challengeProgress.data.progress /
                    dailyChallenge.data.units) *
                    100
                )}
                % završen
              </Text>
            </View>
          ) : (
            <Text className="text-foreground">Vaš napredak se učitava...</Text>
          )}
        </View>
      ) : (
        <Text className="text-foreground">
          Vaš današnji izazov se učitava...
        </Text>
      )}
      <Button title="Go to izazovi" onPress={toIzazovi}/>
    </View>
  );
}
