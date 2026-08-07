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
  lat?: number | null;
  lng?: number | null;
  user?: { id: number; name: string } | null;
  signupCount: number;
  messageCount: number;
}

export interface Participant {
  id: number;
  name: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  createdAt: string;
  user: { id: number; name: string };
}

export interface Profile {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}
