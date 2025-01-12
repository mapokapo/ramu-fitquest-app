import { themeDatas } from "@/lib/const/color-theme";
import { cn } from "@/lib/utils";
import { useColorScheme } from "nativewind";
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
  leftIcon?: ({
    size,
    color,
  }: {
    size: number;
    color: string;
  }) => React.ReactNode;
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
  const { colorScheme } = useColorScheme();

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
        <View className="pl-2">
          {leftIcon !== undefined
            ? leftIcon({
                size: 24,
                color: `hsl(${themeDatas[colorScheme ?? "light"]["foreground"]})`,
              })
            : null}
        </View>
        <TextInput
          className={cn(
            inputVariants({
              variant,
              className: textInputClassName,
            })
          )}
          placeholderTextColor={`hsl(${themeDatas[colorScheme ?? "light"]["muted-foreground"]})`}
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
