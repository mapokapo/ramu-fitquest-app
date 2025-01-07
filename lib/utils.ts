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
      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Nepoznata greška.";
};
