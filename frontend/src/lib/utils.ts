import { twMerge } from "tw-merge";
import { clsx, ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPrettyMood = (mood: number) => {
  switch (mood) {
    case 0:
      return "Awful";
    case 1:
      return "Bad";
    case 2:
      return "Meh";
    case 3:
      return "Good";
    case 4:
      return "Rad";
    default:
      return "Unknown";
  }
}