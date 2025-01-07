import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { ScrollView, Text, View } from "react-native";

export default function Home() {
  return (
    <ScrollView>
      <View>
        <Text>Ulogirali ste se!
          Dobrodosli na pocetnu stranicu.
        </Text>
        <Button title="Odlogiraj se" onPress={() => {}} />
      </View>
    </ScrollView>
  );
}
