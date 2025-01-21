import Button from "@/components/ui/button";
import { useAppProfile } from "@/lib/context/profile-provider";
import { useAppUser } from "@/lib/context/user-provider";
import { supabase } from "@/lib/supabase";
import { Text, View, Image } from "react-native";
import ProfilePicture from "@/components/ui/ProfilePicture";

export default function Home() {
  const user = useAppUser();
  const profile = useAppProfile();

  return (
    <View className="flex-1 gap-8 bg-background p-8">
      <Text className="text-foreground">
        Ulogirali ste se! Dobrodošli na početnu stranicu.
      </Text>
      <ProfilePicture profile_picture_url={profile.profile_picture_url}/>
      <Text className="text-foreground">
        Vaš email: {user.email ?? "Nepoznato"}
      </Text>
      <View>
        <Text className="text-foreground">Vaše ime: {profile.name}</Text>
        <Text className="text-foreground">Vaši bodovi: {profile.points}</Text>
      </View>
      <Button
        title="Odjavi se"
        onPress={() => {
          supabase.auth.signOut();
        }}
      />
    </View>
  );
}
