// Zentrales Datenmodell für die ganze App.
// Heißt EventItem, weil der Name "Event" im Browser schon vergeben ist (DOM-Event).

export type Category = "Konzert" | "Party" | "Kino" | "Festival" | "Uni";

export const categories: Category[] = ["Konzert", "Party", "Kino", "Festival", "Uni"];

export interface EventItem {
  id: number;
  title: string;
  date: string;
  time?: string | null;
  city: string;
  category: string;
  price: number; // 0 = kostenlos
  description?: string | null;
  user?: { id: number; name: string } | null;
}

export interface Profile {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}
