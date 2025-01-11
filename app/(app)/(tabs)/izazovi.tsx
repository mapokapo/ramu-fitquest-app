import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Button from "@/components/ui/button";
import { useAppUser } from "@/lib/context/user-provider";
import { supabase } from "@/lib/supabase";
import { toast } from "burnt";

const izazoviLista = [
  "Pređi 2 kilometra",
  "Napraviti 50 sklekova",
  "Odraditi 10 minuta istezanja",
  "Popiti 2 litre vode",
  "Napraviti plank 5 minuta",
  "Prošetati 10.000 koraka",
  "Pročitati 10 stranica knjige",
  "Napraviti 100 trbušnjaka",
  "Pokazati partneru tko je zvijer u krevetu",
  "Napraviti 20 čučnjeva",
  "Prošetati 5 kilometara",
  "Odraditi 15 minuta joge",
];

export default function Izazovi() {
  const user = useAppUser();
  const [trenutniIzazov, setTrenutniIzazov] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generirajNoviIzazov();
  }, []);

  const generirajNoviIzazov = () => {
    const randomIndex = Math.floor(Math.random() * izazoviLista.length);
    setTrenutniIzazov(izazoviLista[randomIndex]);
  };

  const zavrsiIzazov = async () => {
    setIsLoading(true);

    try {
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("points")
        .eq("id", user.id)
        .single();

      if (fetchError) {
        throw new Error("Greška pri dohvaćanju bodova: " + fetchError.message);
      }

      const newPoints = (profile?.points || 0) + 20;
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ points: newPoints })
        .eq("id", user.id);

      if (updateError) {
        throw new Error("Greška pri dodavanju bodova: " + updateError.message);
      }

      toast({
        title: "Izazov završen!",
        message: "Osvojili ste 20 bodova.",
      });
      generirajNoviIzazov();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Greška!",
          message: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 gap-8 bg-background p-8">
      <Text className="text-xl font-bold">Trenutni izazov:</Text>
      <Text className="mb-4 text-lg">{trenutniIzazov}</Text>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
        />
      ) : (
        <Button
          title="Završi izazov (+20 bodova)"
          onPress={zavrsiIzazov}
        />
      )}
    </View>
  );
}
