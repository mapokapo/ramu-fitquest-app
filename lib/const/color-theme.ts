import { DarkTheme } from "@react-navigation/native";
import { vars } from "nativewind";

type Theme = {
  background: string;
  foreground: string;
  primary: string;
  "primary-foreground": string;
  muted: string;
  "muted-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  border: string;
  input: string;
  ring: string;
  radius: string;
};

export const themeDatas: {
  light: Theme;
  dark: Theme;
} = {
  light: {
    background: "192 15% 94%",
    foreground: "210 29% 24%",
    primary: "204 70% 53%",
    "primary-foreground": "192 15% 94%",
    muted: "204 8% 85%",
    "muted-foreground": "210 29% 29%",
    destructive: "6 78% 57%",
    "destructive-foreground": "210 29% 24%",
    border: "210 29% 29%",
    input: "210 29% 29%",
    ring: "210 29% 29%",
    radius: "0.3rem",
  },
  dark: {
    background: "210 29% 24%",
    foreground: "192 15% 94%",
    primary: "204 64% 44%",
    "primary-foreground": "192 15% 94%",
    muted: "210 29% 32%",
    "muted-foreground": "204 8% 76%",
    destructive: "6 78% 57%",
    "destructive-foreground": "210 29% 24%",
    border: "192 15% 94%",
    input: "192 15% 94%",
    ring: "192 15% 94%",
    radius: "0.3rem",
  },
};

export const themes = {
  light: vars({
    "--background": themeDatas.light.background,
    "--foreground": themeDatas.light.foreground,
    "--primary": themeDatas.light.primary,
    "--primary-foreground": themeDatas.light["primary-foreground"],
    "--muted": themeDatas.light.muted,
    "--muted-foreground": themeDatas.light["muted-foreground"],
    "--destructive": themeDatas.light.destructive,
    "--destructive-foreground": themeDatas.light["destructive-foreground"],
    "--border": themeDatas.light.border,
    "--input": themeDatas.light.input,
    "--ring": themeDatas.light.ring,
    "--radius": themeDatas.light.radius,
  }),
  dark: vars({
    "--background": themeDatas.dark.background,
    "--foreground": themeDatas.dark.foreground,
    "--primary": themeDatas.dark.primary,
    "--primary-foreground": themeDatas.dark["primary-foreground"],
    "--muted": themeDatas.dark.muted,
    "--muted-foreground": themeDatas.dark["muted-foreground"],
    "--destructive": themeDatas.dark.destructive,
    "--destructive-foreground": themeDatas.dark["destructive-foreground"],
    "--border": themeDatas.dark.border,
    "--input": themeDatas.dark.input,
    "--ring": themeDatas.dark.ring,
    "--radius": themeDatas.dark.radius,
  }),
};

export const reactNavigationThemes: (
  isDarkMode: boolean
) => ReactNavigation.Theme = isDarkMode => ({
  colors: {
    background: `hsl(${themeDatas[isDarkMode ? "dark" : "light"]["background"]})`,
    border: `hsl(${themeDatas[isDarkMode ? "dark" : "light"]["border"]})`,
    card: `hsl(${themeDatas[isDarkMode ? "dark" : "light"]["primary"]})`,
    notification: `hsl(${themeDatas[isDarkMode ? "dark" : "light"]["destructive"]})`,
    primary: `hsl(${themeDatas[isDarkMode ? "dark" : "light"]["primary-foreground"]})`,
    text: `hsl(${themeDatas[isDarkMode ? "dark" : "light"]["primary-foreground"]})`,
  },
  dark: isDarkMode,
  fonts: DarkTheme.fonts,
});
