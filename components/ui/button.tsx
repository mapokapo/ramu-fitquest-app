import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";
import { Pressable, PressableProps, Text, View } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "flex items-center justify-center whitespace-nowrap rounded-md disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-primary active:bg-primary/90",
      destructive: "bg-destructive active:bg-destructive/90",
      outline: "border border-input bg-background active:bg-accent",
      secondary: "bg-secondary active:bg-secondary/80",
      ghost: "bg-background active:bg-accent",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const buttonTextVariants = tv({
  base: "text-sm font-medium",
  variants: {
    variant: {
      default: "text-primary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-foreground",
      "outline-pressed": "text-accent-foreground",
      secondary: "text-secondary-foreground",
      ghost: "text-foreground",
      "ghost-pressed": "text-accent-foreground",
    },
    pressed: {
      true: "text-opacity-80",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ButtonProps
  extends Omit<PressableProps, "children">,
    VariantProps<typeof buttonVariants> {
  title: string;
}

const Button: React.FC<ButtonProps> = forwardRef<View, ButtonProps>(
  ({ className, variant, size, title, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        className={cn(
          buttonVariants({
            variant,
            size,
            className,
          })
        )}
        {...props}>
        {({ pressed }) => (
          <Text
            className={cn(
              buttonTextVariants({
                variant:
                  variant === "outline" && pressed
                    ? "outline-pressed"
                    : variant === "ghost" && pressed
                      ? "ghost-pressed"
                      : variant,
              })
            )}>
            {title}
          </Text>
        )}
      </Pressable>
    );
  }
);
Button.displayName = "Button";

export default Button;
