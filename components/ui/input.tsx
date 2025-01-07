import { cn } from "@/lib/utils";
import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

const inputVariants = tv({
  base: "h-10 px-4 py-2 rounded-md border border-input",
  variants: {
    variant: {
      default: "bg-background text-foreground",
      error: "border border-destructive bg-background text-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface InputProps
  extends Omit<TextInputProps, "children">,
    VariantProps<typeof inputVariants> {
  errorText?: string;
}

const Input: React.FC<InputProps> = ({
  className,
  variant,
  errorText,
  ...props
}) => {
  return (
    <View>
      <TextInput
        className={cn(
          inputVariants({
            variant,
            className,
          })
        )}
        {...props}
      />
      {errorText && (
        <Text className="text-sm text-destructive">{errorText}</Text>
      )}
    </View>
  );
};
export default Input;
