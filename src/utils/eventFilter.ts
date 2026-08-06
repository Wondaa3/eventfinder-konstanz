import type { EventItem } from "../types";

export type SortOption = "datum" | "preis" | "titel";

export interface Filters {
  query: string;
  city: string;
  category: string;
  onlyFree: boolean;
}

export const ALL_CATEGORIES = "Alle";

export function filterEvents(events: EventItem[], filters: Filters) {
  const query = filters.query.toLowerCase();
  const city = filters.city.toLowerCase();

  return events.filter((event) => {
    const matchesQuery =
      event.title.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query) ||
      (event.description ?? "").toLowerCase().includes(query);
    const matchesCity = event.city.toLowerCase().includes(city);
    const matchesCategory =
      filters.category === ALL_CATEGORIES || event.category === filters.category;
    const matchesPrice = !filters.onlyFree || event.price === 0;

    return matchesQuery && matchesCity && matchesCategory && matchesPrice;
  });
}

export function sortEvents(events: EventItem[], sort: SortOption) {
  const copy = [...events];
  if (sort === "preis") {
    return copy.sort((a, b) => a.price - b.price);
  }
  if (sort === "titel") {
    return copy.sort((a, b) => a.title.localeCompare(b.title, "de"));
  }
  return copy.sort((a, b) => a.date.localeCompare(b.date));
}
