import Button from "@/components/ui/button";
import { useAppProfile } from "@/lib/context/profile-provider";
import { useAppUser } from "@/lib/context/user-provider";
import { supabase } from "@/lib/supabase";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import ProfilePicture from "@/components/ui/ProfilePicture";

export default function Home() {
  const user = useAppUser();
  const profile = useAppProfile();

  return (
    <View className="flex-1 gap-12 bg-background p-8">
      <Text className="text-foreground text-xl">
        Dobrodošli na <b>FitQuest!</b><br/>
        Jeste spremni za sljedeći izazov?
      </Text>

      <View className="flex-1 gap-8 bg-background p-8 flex-row">
        <ProfilePicture profile_picture_url={profile.profile_picture_url} classname="h-24 w-24 rounded-full"/>
        <View className="flex-1 gap-2 bg-background">
          <Text className="text-foreground text-xl font-bold">{profile.name}</Text>
          <Text className="text-foreground">Vaši bodovi: {profile.points}</Text>
        </View>
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
