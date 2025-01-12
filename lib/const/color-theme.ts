import { DarkTheme } from "@react-navigation/native";
import { vars } from "nativewind";

export const themes = {
  light: vars({
    "--background": "192 15% 94%",
    "--foreground": "210 29% 24%",
    "--primary": "204, 70%, 53%",
    "--primary-foreground": "192 15% 94%",
    "--muted": "204 8% 85%",
    "--muted-foreground": "210 29% 29%",
    "--destructive": "6 78% 57%",
    "--destructive-foreground": "210 29% 24%",
    "--border": "210 29% 29%",
    "--input": "210 29% 29%",
    "--ring": "210 29% 29%",
    "--radius": "0.3rem",
  }),
  dark: vars({
    "--background": "210 29% 24%",
    "--foreground": "192 15% 94%",
    "--primary": "204 64% 44%",
    "--primary-foreground": "192 15% 94%",
    "--muted": "210 29% 32%",
    "--muted-foreground": "204 8% 76%",
    "--destructive": "6 78% 57%",
    "--destructive-foreground": "210 29% 24%",
    "--border": "192 15% 94%",
    "--input": "192 15% 94%",
    "--ring": "192 15% 94%",
    "--radius": "0.3rem",
  }),
};

export const reactNavigationThemes: (
  isDarkMode: boolean
) => ReactNavigation.Theme = isDarkMode => ({
  colors: {
    background: `hsl(${themes[isDarkMode ? "dark" : "light"]["--background"]})`,
    border: `hsl(${themes[isDarkMode ? "dark" : "light"]["--border"]})`,
    card: `hsl(${themes[isDarkMode ? "dark" : "light"]["--primary"]})`,
    notification: `hsl(${themes[isDarkMode ? "dark" : "light"]["--destructive"]})`,
    primary: `hsl(${themes[isDarkMode ? "dark" : "light"]["--primary-foreground"]})`,
    text: `hsl(${themes[isDarkMode ? "dark" : "light"]["--primary-foreground"]})`,
  },
  dark: isDarkMode,
  fonts: DarkTheme.fonts,
});
