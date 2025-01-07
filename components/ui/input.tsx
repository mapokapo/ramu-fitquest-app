import { cn } from "@/lib/utils";
import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

const inputVariants = tv({
  base: "h-10 px-4 py-2 flex-1 rounded-md",
  variants: {
    variant: {
      default: "bg-background text-foreground",
      error: "bg-background text-destructive",
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
  leftIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  className,
  textInputClassName,
  errorTextClassName,
  labelClassName,
  variant,
  label,
  errorText,
  leftIcon,
  ...props
}) => {
  return (
    <View className={className}>
      {label && (
        <Text className={cn("text-sm text-muted-foreground", labelClassName)}>
          {label}
        </Text>
      )}
      <View
        className={cn(
          "flex-row items-center rounded-md border border-input",
          errorText && "border-destructive"
        )}>
        <View className="pl-2">{leftIcon}</View>
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
      </View>
      {errorText && (
        <Text className={cn("text-sm text-destructive", errorTextClassName)}>
          {errorText}
        </Text>
      )}
    </View>
  );
};
export default Input;
