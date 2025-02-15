import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image } from "react-native";
import Button from "@/components/ui/button";
import { useAppUser } from "@/lib/context/user-provider";
import { supabase, supabaseConfig } from "@/lib/supabase";
import { toast } from "burnt";
import AsyncValue from "@/lib/types/AsyncValue";
import { Tables } from "@/lib/types/SupabaseDatabaseTypes";
import { mapError } from "@/lib/utils";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import { Ionicons } from "@expo/vector-icons";
import { themeDatas } from "@/lib/const/color-theme";
import { useColorScheme } from "nativewind";
import { challengesTranslationMap } from "@/lib/const/challenges-translation-map";
import { usePedometer } from "@/lib/hooks/usePedometer";
import { useDistance } from "@/lib/hooks/useDistance";
import CircularProgress from "react-native-circular-progress-indicator";

export default function Izazovi() {
  const user = useAppUser();
  const { colorScheme } = useColorScheme();

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
  const [image, setImage] = useState<
    AsyncValue<
      string | null | (ImagePicker.ImagePickerAsset & { base64: string })
    >
  >({
    loaded: false,
  });

  const [hasChanges, setHasChanges] = useState(false);
  // currentSteps je broj koraka koje je korisnik napravio za trenutni izazov. Kada korisnik pravi korake, onda se vrijednost currentSteps povećava, no ova promjena je lokalna tj. ne ažurira se ništa na Supabase-u. Potrebno je dodati gumb "Pohrani promjene" ili koristiti useEffect kako bi se automatski detektiralo koliko često ažurirati podatke na Supabase-u (npr. nije potrebno ažurirati svaki korak ili svaki metar pređenog puta, već svakih 100 koraka ili 100 metara).
  const { currentSteps } = usePedometer(0);
  const { currentDistance } = useDistance(0);

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

      if (
        data &&
        dailyChallenge.loaded &&
        data.progress >= dailyChallenge.data.units
      ) {
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

  useEffect(() => {
    if (
      challengeProgress.loaded &&
      challengeProgress.data.picture_url !== null
    ) {
      setImage({ loaded: true, data: challengeProgress.data.picture_url });
    }
  }, [challengeProgress]);

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

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (
      !result.canceled &&
      result.assets.length > 0 &&
      result.assets[0].base64 !== undefined &&
      result.assets[0].base64 !== null
    ) {
      setImage({
        loaded: true,
        data: result.assets[0] as ImagePicker.ImagePickerAsset & {
          base64: string;
        },
      });
      setHasChanges(true);
    }
  };

  const handleUploadChallengePicture = async () => {
    if (!dailyChallenge.loaded || !challengeProgress.loaded) {
      return;
    }

    let newImageUrl = null;
    if (image.loaded && image.data !== null && typeof image.data !== "string") {
      const { data, error: storageError } = await supabase.storage
        .from("picture_challenges")
        .upload(
          `${user.id}/${challengeProgress.data.id}`,
          decode(image.data.base64),
          {
            contentType: image.data.mimeType,
            upsert: true,
          }
        );

      if (storageError) {
        const message = mapError(storageError);
        toast({
          title: "Greška prilikom uploada slike",
          message: message,
        });
        console.error("Error uploading image:", storageError);
        return;
      }

      newImageUrl = `${supabaseConfig.supabaseUrl}/storage/v1/object/public/${data.fullPath}`;
    }

    const { error } = await supabase
      .from("user_challenges")
      .update({
        picture_url: newImageUrl ?? undefined,
        progress: newImageUrl
          ? dailyChallenge.data.units
          : challengeProgress.data.progress,
      })
      .eq("id", challengeProgress.data.id);

    if (error) {
      const message = mapError(error);
      toast({
        title: "Greška prilikom ažuriranja slike izazova",
        message: message,
      });
      console.error("Error updating challenge picture:", error);
    }

    setHasChanges(false);

    toast({
      title: "Slika uspješno ažurirana",
      message: "Vaša slika je uspješno ažurirana!",
    });
  };

  const [oldValue, setOldValue] = useState(0);
  const [isUpdating, setIsUpdating] = useState(true);

  const updateSteps = useCallback(async () => {
    if (
      !dailyChallenge.loaded ||
      !challengeProgress.loaded ||
      dailyChallenge.data.challenge.challenge_code !== "walk_steps" ||
      !isUpdating
    ) {
      return;
    }
    if (
      currentSteps + challengeProgress.data.progress >=
      dailyChallenge.data.units
    ) {
      const { error } = await supabase
        .from("user_challenges")
        .update({
          user_id: user.id,
          daily_challenge_id: dailyChallenge.data.id,
          progress: dailyChallenge.data.units,
        })
        .eq("user_id", user.id)
        .eq("daily_challenge_id", dailyChallenge.data.id);

      if (error) {
        const message = mapError(error);
        toast({
          title: "Greška pri ažuriranju koraka",
          message: message,
        });
        console.error("Error updating steps:", error);
        return;
      }
      setChallengeProgress(prev => {
        if (!prev.loaded) return prev;

        return {
          loaded: true,
          data: {
            ...prev.data,
            progress: challengeProgress.data.progress + currentSteps,
          },
        };
      });
      setIsUpdating(false);
      toast({
        title: "Čestitamo, već ste završili dnevni izazov!",
        message: "Posjetite nas sutra za novi izazov!",
      });
    } else if (currentSteps - 20 >= oldValue) {
      setOldValue(currentSteps);
      const { error } = await supabase
        .from("user_challenges")
        .update({
          user_id: user.id,
          daily_challenge_id: dailyChallenge.data.id,
          progress: challengeProgress.data.progress + currentSteps,
        })
        .eq("user_id", user.id)
        .eq("daily_challenge_id", dailyChallenge.data.id);

      if (error) {
        const message = mapError(error);
        toast({
          title: "Greška pri ažuriranju koraka",
          message: message,
        });
        console.error("Error updating steps:", error);
        return;
      }
      setChallengeProgress(prev => {
        if (!prev.loaded) return prev;

        return {
          loaded: true,
          data: {
            ...prev.data,
            progress: challengeProgress.data.progress + currentSteps,
          },
        };
      });
    }
  }, [
    challengeProgress,
    dailyChallenge,
    currentSteps,
    user,
    isUpdating,
    oldValue,
  ]);

  const updateDistance = useCallback(async () => {
    if (
      !dailyChallenge.loaded ||
      !challengeProgress.loaded ||
      dailyChallenge.data.challenge.challenge_code !== "walk_m" ||
      !isUpdating
    ) {
      return;
    }
    if (
      Math.floor(currentDistance) + challengeProgress.data.progress >=
      dailyChallenge.data.units
    ) {
      const { error } = await supabase
        .from("user_challenges")
        .update({
          user_id: user.id,
          daily_challenge_id: dailyChallenge.data.id,
          progress: dailyChallenge.data.units,
        })
        .eq("user_id", user.id)
        .eq("daily_challenge_id", dailyChallenge.data.id);

      if (error) {
        const message = mapError(error);
        toast({
          title: "Greška pri ažuriranju koraka",
          message: message,
        });
        console.error("Error updating steps:", error);
        return;
      }
      setChallengeProgress(prev => {
        if (!prev.loaded) return prev;

        return {
          loaded: true,
          data: {
            ...prev.data,
            progress:
              challengeProgress.data.progress + Math.floor(currentDistance),
          },
        };
      });
      setIsUpdating(false);
      toast({
        title: "Čestitamo, već ste završili dnevni izazov!",
        message: "Posjetite nas sutra za novi izazov!",
      });
    } else if (Math.floor(currentDistance) - 10 >= oldValue) {
      setOldValue(Math.floor(currentDistance));
      const { error } = await supabase
        .from("user_challenges")
        .update({
          user_id: user.id,
          daily_challenge_id: dailyChallenge.data.id,
          progress:
            challengeProgress.data.progress + Math.floor(currentDistance),
        })
        .eq("user_id", user.id)
        .eq("daily_challenge_id", dailyChallenge.data.id);

      if (error) {
        const message = mapError(error);
        toast({
          title: "Greška pri ažuriranju koraka",
          message: message,
        });
        console.error("Error updating steps:", error);
        return;
      }
      setChallengeProgress(prev => {
        if (!prev.loaded) return prev;
        return {
          loaded: true,
          data: {
            ...prev.data,
            progress:
              challengeProgress.data.progress + Math.floor(currentDistance),
          },
        };
      });
    }
  }, [
    challengeProgress,
    dailyChallenge,
    currentDistance,
    user,
    isUpdating,
    oldValue,
  ]);

  useEffect(() => {
    updateSteps();
  }, [currentSteps, updateSteps]);

  useEffect(() => {
    updateDistance();
  }, [currentDistance, updateDistance]);

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
            <View className="mt-24 items-center gap-4">
              {dailyChallenge.data.challenge.challenge_code ===
              "take_picture" ? (
                image.loaded ? (
                  image.data !== null && (
                    <View className="items-center gap-2">
                      <Text className="text-2xl font-bold text-foreground">
                        Vaša slika:
                      </Text>
                      <Image
                        className="h-32 w-32 rounded-full"
                        source={{
                          uri:
                            typeof image.data === "string"
                              ? `${image.data}?${Date.now()}`
                              : image.data.uri,
                        }}
                      />
                    </View>
                  )
                ) : (
                  <View className="items-center gap-2">
                    <Ionicons
                      name="image-outline"
                      size={128}
                      color={`hsl(${themeDatas[colorScheme ?? "light"]["muted-foreground"]})`}
                    />
                    <Text className="text-foreground">
                      Niste odabrali sliku
                    </Text>
                  </View>
                )
              ) : dailyChallenge.data.challenge.challenge_code ===
                "walk_steps" ? (
                <CircularProgress
                  value={challengeProgress.data.progress + (currentSteps % 21)}
                  maxValue={dailyChallenge.data.units}
                  radius={100}
                  activeStrokeColor={"#4CAF50"}
                  inActiveStrokeColor={"#D3D3D3"}
                  inActiveStrokeOpacity={0.5}
                  title={`${challengeProgress.data.progress + (currentSteps % 21)}/${dailyChallenge.data.units}`}
                  titleStyle={{ fontSize: 14 }}
                />
              ) : dailyChallenge.data.challenge.challenge_code === "walk_m" ? (
                <CircularProgress
                  value={
                    challengeProgress.data.progress +
                    (Math.floor(currentDistance) % 11)
                  }
                  maxValue={dailyChallenge.data.units}
                  radius={100}
                  activeStrokeColor={"#4CAF50"}
                  inActiveStrokeColor={"#D3D3D3"}
                  inActiveStrokeOpacity={0.5}
                  title={`${challengeProgress.data.progress + Math.floor(currentDistance % 11)}/${dailyChallenge.data.units}`}
                  titleStyle={{ fontSize: 14 }}
                />
              ) : (
                <Text className="text-foreground">
                  Vaš napredak:{" "}
                  {Math.round(
                    (challengeProgress.data.progress /
                      dailyChallenge.data.units) *
                      100
                  )}
                  % završen
                </Text>
              )}

              {dailyChallenge.data.challenge.challenge_code ===
              "take_picture" ? (
                <View className="gap-4">
                  <Button
                    title="Odaberite sliku"
                    onPress={handlePickImage}
                  />
                  {hasChanges && (
                    <Button
                      title="Spasi sliku"
                      onPress={handleUploadChallengePicture}
                    />
                  )}
                </View>
              ) : (
                <>
                  <Text className="text-center text-foreground">
                    Vaš napredak:{" "}
                    {Math.round(
                      (challengeProgress.data.progress /
                        dailyChallenge.data.units) *
                        100
                    )}
                    % završen
                  </Text>
                  <View className="mt-4">
                    <Button
                      title="(DEBUG) Dodaj +20% na napredak na izazov"
                      onPress={debug_addProgess}
                    />
                  </View>
                </>
              )}
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
    </View>
  );
}
