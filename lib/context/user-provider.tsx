import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncValue from "../types/AsyncValue";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export type User = Session["user"];

type UserProviderProps = PropsWithChildren;

type UserProviderState = {
  user: AsyncValue<User | null>;
  setUser: (user: AsyncValue<User | null>) => void;
};

const initialState: UserProviderState = {
  user: {
    loaded: false,
  },
  setUser: () => {},
};

const UserProviderContext = createContext<UserProviderState>(initialState);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AsyncValue<User | null>>({
    loaded: false,
  });

  useEffect(() => {
    return supabase.auth.onAuthStateChange((_, session) => {
      setUser({
        loaded: true,
        data: session?.user ?? null,
      });
    }).data.subscription.unsubscribe;
  }, []);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <UserProviderContext.Provider value={value}>
      {children}
    </UserProviderContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserProviderContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

export function useAppUser() {
  const { user } = useUser();

  if (!user.loaded) {
    throw new Error(
      "useAppUser must be used within a UserProvider that has loaded the auth state"
    );
  }

  if (user.data === null) {
    throw new Error(
      "useAppUser must be used within a UserProvider that has a signed-in user"
    );
  }

  return user.data;
}
