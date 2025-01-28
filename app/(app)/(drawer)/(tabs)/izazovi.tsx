import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import Button from "@/components/ui/button";
import { useAppUser } from "@/lib/context/user-provider";
import { supabase, supabaseConfig } from "@/lib/supabase";
import { toast } from "burnt";
import AsyncValue from "@/lib/types/AsyncValue";
import { Tables } from "@/lib/types/SupabaseDatabaseTypes";
import { mapError } from "@/lib/utils";
import { challengesTranslationMap } from "@/lib/const/challenges-translation-map";
import { usePedometer } from "@/lib/hooks/usePedometer";
import { useDistance } from "@/lib/hooks/useDistance";
import { CircularProgressBase } from "react-native-circular-progress-indicator";

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

  const { currentSteps } = usePedometer(
    dailyChallenge.loaded
      ? dailyChallenge.data.challenge.challenge_code !== "walk_steps"
        ? 0
        : challengeProgress.loaded
        ? challengeProgress.data.progress
        : 0
      : 0
  );

  const { currentDistance } = useDistance(
    dailyChallenge.loaded
      ? dailyChallenge.data.challenge.challenge_code !== "walk_kms"
        ? 0
        : challengeProgress.loaded
        ? challengeProgress.data.progress * 1000
        : 0
      : 0
  );

  useEffect(() => {
    async function fetchDailyChallenge() {
      const { data, error } = await supabase
        .from("daily_challenges")
        .select("*, challenge:challenge_id(*)")
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
          title: "Greška pri dohvaćanju vašeg napretka prema postignuću izazova",
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

      if (data && dailyChallenge.loaded && data.progress >= dailyChallenge.data.units) {
        toast({
          title: "Čestitamo, već ste završili dnevni izazov!",
          message: "Posjetite nas sutra za novi izazov!",
        });
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

      if (newProgress >= dailyChallenge.data.units) {
        toast({
          title: "Čestitamo!",
          message: "Završili ste dnevni izazov!",
        });
      }
      
    if (error) {
      const message = mapError(error);
      toast({
        title: "Greška pri označavanju izazova kao završenog",
        message: message,
      });
      console.error("Error completing daily challenge:", error);
      return;
    }

    setChallengeProgress((prev) => {
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
      <Text className="text-xl font-bold text-foreground">
        Današnji izazov:
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
            <View className="items-center gap-4 mt-6">
              {dailyChallenge.data.challenge.challenge_code ===
              "walk_steps" ? (
                <CircularProgressBase
                  value={currentSteps}
                  maxValue={dailyChallenge.data.units}
                  radius={60}
                  activeStrokeColor={"#4CAF50"}
                  inActiveStrokeColor={"#D3D3D3"}
                  inActiveStrokeOpacity={0.5}
                />
              ) : dailyChallenge.data.challenge.challenge_code ===
                "walk_kms" ? (
                <CircularProgressBase
                  value={currentDistance / 1000}
                  maxValue={dailyChallenge.data.units}
                  radius={60}
                  activeStrokeColor={"#4CAF50"}
                  inActiveStrokeColor={"#D3D3D3"}
                  inActiveStrokeOpacity={0.5}
                />
              ) : (
                <Text className="text-foreground">
                  Vaš napredak: {Math.round(
                    (challengeProgress.data.progress /
                      dailyChallenge.data.units) *
                      100
                  )}
                  % završen
                </Text>
              )}
              <Text className="text-foreground text-center">
                  Vaš napredak: {Math.round(
                    (challengeProgress.data.progress /
                      dailyChallenge.data.units) *
                      100
                  )}
                  % završen<br />
                  {currentSteps}/{dailyChallenge.data.units}
                </Text>
              <View className="mt-4">
                <Button
                  title="(DEBUG) Dodaj +20% na napredak na izazov"
                  onPress={debug_addProgess}
                />
              </View>
            </View>
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
    </View>
  );
}
