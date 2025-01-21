import { ProfilePicture } from "@/components/profile-picture";
import Button from "@/components/ui/button";
import { useAppProfile } from "@/lib/context/profile-provider";
import { supabase } from "@/lib/supabase";
import { Text, View } from "react-native";

export default function Home() {
  const profile = useAppProfile();

  return (
    <View className="flex-1 gap-12 bg-background p-8">
      <Text className="text-xl text-foreground">
        Dobrodošli na <b>FitQuest!</b>
        <br />
        Jeste spremni za sljedeći izazov?
      </Text>

      <View className="flex-1 flex-row gap-8 bg-background p-8">
        <ProfilePicture
          profilePictureUrl={profile.profile_picture_url}
          className="h-24 w-24"
        />
        <View className="flex-1 gap-2 bg-background">
          <Text className="text-xl font-bold text-foreground">
            {profile.name}
          </Text>
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
