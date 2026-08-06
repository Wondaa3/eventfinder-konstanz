// Zentrales Datenmodell für die ganze App.
// Heißt EventItem, weil der Name "Event" im Browser schon vergeben ist (DOM-Event).

export type Category = "Konzert" | "Party" | "Kino" | "Festival" | "Uni";

export interface EventItem {
  id: number;
  title: string;
  date: string;
  city: string;
  category: string;
  price: number; // 0 = kostenlos
}
