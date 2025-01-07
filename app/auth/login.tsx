import { useState } from "react";
import { View } from "react-native";
import { supabase } from "../../lib/supabase";
import { toast } from "burnt";
import { mapError } from "@/lib/utils";
import Input from "@/components/ui/input";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/button";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const message = mapError(error);
      toast({
        title: "Greška prilikom prijave",
        message: message,
      });
      console.error(`Error signing in: ${error.message}`);
    }

    setLoading(false);
  }

  //  ---------  MATE OBAVIJEST ZA TEBE  ------------
  //  Ovdje imas jos jednu funkciju signUpWithEmail() koja ce se pozivati kad korisnik zeli kreirati novi account
  //  samo moras dodati novi button koji ce pozivati tu funkciju.

  async function signUpWithEmail() {
    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      const message = mapError(error);
      toast({
        title: "Greška prilikom registracije",
        message: message,
      });
      console.error(`Error signing up: ${error.message}`);
    }

    if (!session) {
      toast({
        title: "Success",
        message: "Pogledajte inbox za verifikaciju emaila!",
      });
    }

    setLoading(false);
  }

  return (
    <View className="flex-1 gap-8 bg-background p-8">
      <View className="flex-row items-end gap-4">
        <Ionicons
          className="mb-2"
          name="mail"
          size={24}
          color="black"
        />
        <Input
          className="flex-1"
          label="Email"
          onChangeText={text => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View className="flex-row items-end gap-4">
        <Ionicons
          className="mb-2"
          name="key"
          size={24}
          color="black"
        />
        <Input
          className="flex-1"
          label="Lozinka"
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Lozinka"
          autoCapitalize={"none"}
        />
      </View>
      <View>
        <Button
          title="Prijavi se"
          disabled={loading}
          onPress={() => signInWithEmail()}
        />
      </View>
    </View>
  );
}
