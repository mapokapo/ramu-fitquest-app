import Button from "@/components/ui/button";
import { useAppProfile } from "@/lib/context/profile-provider";
import { useAppUser } from "@/lib/context/user-provider";
import { supabase } from "@/lib/supabase";
import { Text, View } from "react-native";

export default function Home() {
  const user = useAppUser();
  const profile = useAppProfile();

  return (
    <View className="flex-1 gap-8 bg-background p-8">
      <Text>Ulogirali ste se! Dobrodosli na pocetnu stranicu.</Text>
      <Text>Vas email: {user.email ?? "Nepoznato"}</Text>
      {profile.loaded ? (
        <View>
          <Text>Vaše ime: {profile.data.name}</Text>
          <Text>Vaši bodovi: {profile.data.points}</Text>
        </View>
      ) : (
        <Text>Vaš profil se učitava...</Text>
      )}
      <Button
        title="Odjavi se"
        onPress={() => {
          supabase.auth.signOut();
        }}
      />
    </View>
  );
}
