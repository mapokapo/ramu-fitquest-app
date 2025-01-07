import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { ScrollView, Text, View } from "react-native";

export default function Home() {
  return (
    <ScrollView contentContainerClassName="p-4 gap-8">
      <Text className="text-3xl font-bold">Buttons</Text>
      <View className="gap-4">
        <Text className="text-xl font-bold">Normal size</Text>
        <Button title="Hello" />
        <Button
          title="Hello"
          variant="destructive"
        />
        <Button
          title="Hello"
          variant="ghost"
        />
        <Button
          title="Hello"
          variant="outline"
        />
        <Button
          title="Hello"
          variant="secondary"
        />
      </View>
      <View className="gap-4">
        <Text className="text-xl font-bold">Small size</Text>
        <Button
          title="Hello"
          size="sm"
        />
        <Button
          title="Hello"
          size="sm"
          variant="destructive"
        />
        <Button
          title="Hello"
          size="sm"
          variant="ghost"
        />
        <Button
          title="Hello"
          size="sm"
          variant="outline"
        />
        <Button
          title="Hello"
          size="sm"
          variant="secondary"
        />
      </View>
      <View className="gap-4">
        <Text className="text-xl font-bold">Large size</Text>
        <Button
          title="Hello"
          size="lg"
        />
        <Button
          title="Hello"
          size="lg"
          variant="destructive"
        />
        <Button
          title="Hello"
          size="lg"
          variant="ghost"
        />
        <Button
          title="Hello"
          size="lg"
          variant="outline"
        />
        <Button
          title="Hello"
          size="lg"
          variant="secondary"
        />
      </View>
      <View className="gap-4">
        <Text className="text-xl font-bold">Icon size</Text>
        <View className="flex-row gap-4">
          <Button
            title="Hello"
            size="icon"
          />
          <Button
            title="Hello"
            size="icon"
            variant="destructive"
          />
          <Button
            title="Hello"
            size="icon"
            variant="ghost"
          />
          <Button
            title="Hello"
            size="icon"
            variant="outline"
          />
          <Button
            title="Hello"
            size="icon"
            variant="secondary"
          />
        </View>
      </View>
      <Text className="text-3xl font-bold">Inputs</Text>
      <View className="gap-4">
        <Input placeholder="Hello" />
        <Input
          placeholder="Hello"
          variant="error"
          errorText="This is an error"
        />
      </View>
    </ScrollView>
  );
}
