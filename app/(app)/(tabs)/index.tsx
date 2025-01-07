import Button from "@/components/ui/button";
import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 gap-8 bg-background p-8">
      <Text>Ulogirali ste se! Dobrodosli na pocetnu stranicu.</Text>
      <Button
        title="Odlogiraj se"
        onPress={() => {}}
      />
    </View>
  );
}
