import { useAppSettings } from "@/lib/context/settings-provider";
import { Switch, Text, View } from "react-native";

export default function Settings() {
  const { settings, setSettings } = useAppSettings();

  return (
    <View className="flex-1 gap-8 bg-background p-8">
      <Text className="text-2xl font-bold text-foreground">Settings</Text>
      <View className="gap-2">
        <View className="flex-row justify-between">
          <Text className="text-lg text-foreground">Dark mode</Text>
          <Switch
            value={settings.darkMode}
            onValueChange={value => setSettings({ darkMode: value })}
          />
        </View>
      </View>
    </View>
  );
}
