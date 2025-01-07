import { Text, View, StyleSheet } from "react-native";
import { Button, Input } from "@rneui/themed";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function CreateProfile() {
  const userData = supabase.auth.getUser();
  const [ime, setIme] = useState("");

  async function handleLogout() {
      const { error } = await supabase.auth.signOut();
      if(error)console.log(error);
    }

    async function handleCreate() {
      console.log((await userData).data.user!.id);
      const { error } = await supabase
      .from('profiles')
      .insert({id: (await userData).data.user!.id, name: ime, points: 0})
    }

    return (
      <View style={styles.container}>
        <b>Kreirajte svoj profil!</b>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input
            label="Unesite ime:"
            leftIcon={{ type: "font-awesome", name: "envelope" }}
            onChangeText={text => setIme(text)}
            value={ime}
            placeholder="Unesite ime..."
            autoCapitalize={"none"}
          />
        </View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button
            title="Sign Up"
            onPress={() => handleCreate()}
          />
          <Button
            title="Logout"
            onPress={() => handleLogout()}
          />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});