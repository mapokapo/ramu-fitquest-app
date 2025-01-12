import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncValue from "@/lib/types/AsyncValue";

export type Settings = {
  darkMode: boolean;
};

type SettingsProviderProps = PropsWithChildren;

type SettingsProviderState = {
  settings: AsyncValue<Settings>;
  setSettings: (settings: AsyncValue<Settings>) => void;
};

const initialState: SettingsProviderState = {
  settings: {
    loaded: false,
  },
  setSettings: () => {},
};

const SettingsProviderContext =
  createContext<SettingsProviderState>(initialState);

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AsyncValue<Settings>>({
    loaded: false,
  });

  useEffect(() => {
    AsyncStorage.getItem("settings").then(data => {
      if (data) {
        setSettings({ loaded: true, data: JSON.parse(data) });
      } else {
        setSettings({ loaded: true, data: { darkMode: false } });
      }
    });
  }, []);

  useEffect(() => {
    console.log("settings", settings);

    if (settings.loaded) {
      AsyncStorage.setItem("settings", JSON.stringify(settings.data));
    }
  }, [settings]);

  const value = useMemo(
    () => ({ settings, setSettings }),
    [settings, setSettings]
  );

  return (
    <SettingsProviderContext.Provider value={value}>
      {children}
    </SettingsProviderContext.Provider>
  );
};

export function useSettings() {
  const context = useContext(SettingsProviderContext);

  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }

  return context;
}

export function useAppSettings() {
  const context = useSettings();

  if (!context.settings.loaded) {
    throw new Error(
      "useAppSettings must be used within a SettingsProvider that has loaded the settings"
    );
  }

  return {
    settings: context.settings.data,
    setSettings: (settings: Settings) =>
      context.setSettings({ loaded: true, data: settings }),
  };
}
