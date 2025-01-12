import { User } from "@/lib/context/user-provider";
import { Tables } from "@/lib/types/SupabaseDatabaseTypes";
import { cn } from "@/lib/utils";
import { Text, View } from "react-native";

type Props = {
  profile: Tables<"profiles">;
  currentUser: User;
  index: number;
};

const LeaderboardItem: React.FC<Props> = ({ profile, currentUser, index }) => (
  <View
    className={cn(
      "flex-row justify-between border-b border-gray-200 px-4 py-2",
      profile.id === currentUser.id && "bg-gray-100"
    )}>
    <Text>
      {index + 1}. {profile.name}
    </Text>
    <Text>{profile.points} bodova</Text>
  </View>
);

export default LeaderboardItem;
