import { cn } from "@/lib/utils";
import { Image, ImageProps } from "react-native";

type Props = ImageProps & {
  profilePictureUrl: null | string;
};

export const ProfilePicture: React.FC<Props> = ({
  profilePictureUrl,
  className,
  ...rest
}) => {
  return (
    <Image
      {...rest}
      className={cn("h-32 w-32 rounded-full", className)}
      source={{
        uri:
          profilePictureUrl !== null
            ? `${profilePictureUrl}?${Date.now()}`
            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      }}
      defaultSource={{
        uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      }}
    />
  );
};
