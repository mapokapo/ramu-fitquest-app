import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import Button from "@/components/ui/button";
import { useAppUser } from "@/lib/context/user-provider";
import { supabase } from "@/lib/supabase";
import { toast } from "burnt";
import AsyncValue from "@/lib/types/AsyncValue";
import { Tables } from "@/lib/types/SupabaseDatabaseTypes";
import { mapError } from "@/lib/utils";

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

export default function Izazovi() {
  const user = useAppUser();
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
        .filter("date", "eq", new Date().toISOString().split("T")[0])
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

  const debug_addProgess = async () => {
    if (!dailyChallenge.loaded || !challengeProgress.loaded) {
      return;
    }

    const newProgress = Math.min(
      Math.max(
        Math.floor(
          challengeProgress.data.progress + dailyChallenge.data.units * 0.2
        ),
        0
      ),
      dailyChallenge.data.units
    );

    const { error } = await supabase
      .from("user_challenges")
      .update({
        user_id: user.id,
        daily_challenge_id: dailyChallenge.data.id,
        progress: newProgress,
      })
      .eq("user_id", user.id)
      .eq("daily_challenge_id", dailyChallenge.data.id);

    if (error) {
      const message = mapError(error);
      toast({
        title: "Greška pri označavanju izazova kao završenog",
        message: message,
      });
      console.error("Error completing daily challenge:", error);
      return;
    }

    setChallengeProgress(prev => {
      if (!prev.loaded) return prev;

      return {
        loaded: true,
        data: {
          ...prev.data,
          progress: newProgress,
        },
      };
    });
  };

  return (
    <View className="flex-1 gap-8 bg-background p-8">
      <Text className="text-xl font-bold">Današnji izazov:</Text>
      {dailyChallenge.loaded ? (
        <View>
          <Text className="mb-4 text-lg">
            {challengesTranslationMap(
              dailyChallenge.data.challenge.challenge_code,
              dailyChallenge.data.units
            ) ?? "Nepoznati izazov"}
          </Text>
          {challengeProgress.loaded ? (
            <View>
              <Text>
                Vaš napredak:{" "}
                {Math.round(
                  (challengeProgress.data.progress /
                    dailyChallenge.data.units) *
                    100
                )}
                % završen
              </Text>
              <Button
                title="(DEBUG) Dodaj +20% na napredak na izazov"
                onPress={debug_addProgess}
              />
            </View>
          ) : (
            <Text>Vaš napredak se učitava...</Text>
          )}
        </View>
      ) : (
        <Text>Vaš današnji izazov se učitava...</Text>
      )}
    </View>
  );
}
