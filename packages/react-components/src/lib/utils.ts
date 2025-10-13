import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Get initials from a name for avatar display
 * @param name - Full name (one or more words)
 * @returns Two-letter initials in uppercase
 * 
 * @example
 * getInitials("John Doe") // returns "JD"
 * getInitials("Alice") // returns "AL"
 * getInitials("") // returns "?"
 */
export function getInitials(name: string): string {
  // Trim and handle empty string
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    return "?";
  }
  
  // Split name by spaces and filter empty strings
  const nameParts = trimmedName.split(/\s+/).filter(part => part.length > 0);
  
  if (nameParts.length === 0) {
    return "?";
  }
  
  if (nameParts.length === 1) {
    // If only 1 word, take the first 2 letters
    const singleName = nameParts[0]!;
    return singleName.length >= 2
      ? singleName.substring(0, 2).toUpperCase()
      : singleName.charAt(0).toUpperCase();
  }
  
  // If 2+ words, take first letter from first and last word
  const firstInitial = nameParts[0]!.charAt(0);
  const lastInitial = nameParts[nameParts.length - 1]!.charAt(0);
  
  return (firstInitial + lastInitial).toUpperCase();
}