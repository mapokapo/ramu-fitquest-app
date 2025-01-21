import { ProfilePicture } from "@/components/profile-picture";
import { Tables } from "@/lib/types/SupabaseDatabaseTypes";
import { cn } from "@/lib/utils";
import { Text, View } from "react-native";

type Props = {
  profile: Tables<"profiles">;
  currentUser: boolean;
  index: number;
};

const LeaderboardItem: React.FC<Props> = ({ profile, currentUser, index }) => (
  <View
    className={cn(
      "flex-row justify-between border-b border-border px-4 py-2",
      currentUser && "bg-muted"
    )}>
    <ProfilePicture
      profilePictureUrl={profile.profile_picture_url}
      className="h-7 w-7"
    />
    <Text className="text-foreground">
      {index + 1}. {profile.name}
    </Text>
    <Text className="text-foreground">{profile.points} bodova</Text>
  </View>
);

export default LeaderboardItem;
