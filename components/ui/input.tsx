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
  textInputClassName?: string;
  errorTextClassName?: string;
  errorText?: string;
  labelClassName?: string;
  label?: string;
}

const Input: React.FC<InputProps> = ({
  className,
  textInputClassName,
  errorTextClassName,
  labelClassName,
  variant,
  label,
  errorText,
  ...props
}) => {
  return (
    <View className={className}>
      {label && (
        <Text className={cn("text-sm text-muted-foreground", labelClassName)}>
          {label}
        </Text>
      )}
      <TextInput
        className={cn(
          inputVariants({
            variant,
            className: textInputClassName,
          })
        )}
        placeholderClassName="text-muted-foreground"
        {...props}
      />
      {errorText && (
        <Text className={cn("text-sm text-destructive", errorTextClassName)}>
          {errorText}
        </Text>
      )}
    </View>
  );
};
export default Input;
