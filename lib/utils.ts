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

export const computeDistanceBetween = (
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number }
) => {
  const R = 6371e3; // metres
  const φ1 = (a.latitude * Math.PI) / 180; // φ, λ in radians
  const φ2 = (b.latitude * Math.PI) / 180;
  const Δφ = ((b.latitude - a.latitude) * Math.PI) / 180;
  const Δλ = ((b.longitude - a.longitude) * Math.PI) / 180;

  const x =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

  return R * c; // in metres
};
