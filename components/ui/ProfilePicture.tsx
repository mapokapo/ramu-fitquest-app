import { useAppProfile } from "@/lib/context/profile-provider";
import { useAppUser } from "@/lib/context/user-provider"
import { Image, View } from "react-native"

export default function ProfilePicture(profile: { profile_picture_url: null | string, classname?: string; }){
    return ( 
        <View>
            <Image
                className={profile.classname !== undefined ? (profile.classname) : ("h-32 w-32 rounded-full")}
                source={{
                uri:
                    profile.profile_picture_url !== null
                    ? `${profile.profile_picture_url}?${Date.now()}`
                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                }}
                defaultSource={{
                uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                }}
            />
          </View>
    );
}
