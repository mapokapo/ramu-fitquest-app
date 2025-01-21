import { isAuthError } from "@supabase/supabase-js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mapError = (error: unknown) => {
  if (typeof error === "string") {
    return error;
  }

  if (isAuthError(error)) {
    switch (error.code) {
      case "validation_failed":
        return "Neispravni podaci.";
      case "invalid_credentials":
        return "Račun s tim podacima ne postoji.";
      case "weak_password":
        return "Lozinka mora biti barem 6 znakova duga.";
      case "user_already_exists":
        return "Račun s tim emailom već postoji.";
      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Nepoznata greška.";
};

export const insertAt = <T>(array: T[], element: T, index: number): T[] => {
  return [...array.slice(0, index), element, ...array.slice(index)];
};
