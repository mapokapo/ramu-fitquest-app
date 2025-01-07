import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncValue from "../types/AsyncValue";
import { mapError } from "../utils";
import { toast } from "burnt";
import { supabase } from "@/lib/supabase";
import { User } from "@/lib/context/user-provider";

export type Profile = {
  id: string;
  name: string;
};

type ProfileProviderProps = PropsWithChildren & {
  user: User | null;
};

type ProfileProviderState = {
  profile: AsyncValue<Profile | null>;
  setProfile: (profile: AsyncValue<Profile | null>) => void;
};

const initialState: ProfileProviderState = {
  profile: {
    loaded: false,
  },
  setProfile: () => {},
};

const ProfileProviderContext =
  createContext<ProfileProviderState>(initialState);

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
  user,
}) => {
  const [profile, setProfile] = useState<AsyncValue<Profile | null>>({
    loaded: false,
  });

  useEffect(() => {
    if (user === null) {
      setProfile({
        loaded: true,
        data: null,
      });
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        const message = mapError(error);

        toast({
          title: message,
        });

        console.error(`Error fetching profile: ${error.message}`);

        setProfile({
          loaded: true,
          data: null,
        });
        return;
      }

      if (data === null) {
        setProfile({
          loaded: true,
          data: null,
        });
        return;
      }

      setProfile({
        loaded: true,
        data: {
          id: data.id,
          name: data.name,
        },
      });
    };

    fetchProfile();

    const subscription = supabase.realtime
      .channel("profiles")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: "id=eq." + user.id,
        },
        payload => {
          console.log(payload);

          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            setProfile({
              loaded: true,
              data: {
                id: payload.new.id,
                name: payload.new.name,
              },
            });
          } else if (payload.eventType === "DELETE") {
            setProfile({
              loaded: true,
              data: null,
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
    /*
      .onSnapshot(
        snapshot => {
          if (!snapshot.exists) {
            setProfile({
              loaded: true,
              data: null,
            });
            return;
          }

          setProfile({
            loaded: true,
            data: {
              uid: snapshot.id,
              name: snapshot.get("name"),
              dateOfBirth: (snapshot.get("dateOfBirth") as Timestamp).toDate(),
              email: snapshot.get("email"),
              photoURL: snapshot.get<string | null>("photoURL") ?? undefined,
              points: snapshot.get("points"),
            },
          });
        },
        e => {
          const message = mapError(e);

          toast({
            title: message,
          });

          console.error(e);

          setProfile({
            loaded: true,
            data: null,
          });
        }
      );*/
  }, [user]);

  const value = useMemo(() => ({ profile, setProfile }), [profile, setProfile]);

  return (
    <ProfileProviderContext.Provider value={value}>
      {children}
    </ProfileProviderContext.Provider>
  );
};

export function useProfile() {
  const context = useContext(ProfileProviderContext);

  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }

  return context;
}

export function useAppProfile(): AsyncValue<Profile> {
  const { profile } = useProfile();

  if (profile.loaded) {
    const data = profile.data;

    if (data === null) {
      throw new Error(
        "useAppProfile must be used within a ProfileProvider that has non-null profile data"
      );
    }

    return {
      loaded: true,
      data,
    };
  } else {
    return {
      loaded: false,
    };
  }
}
