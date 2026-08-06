import { describe, it, expect } from "vitest";
import { ALL_CATEGORIES, filterEvents, sortEvents } from "./eventFilter";
import type { EventItem } from "../types";

const events: EventItem[] = [
  {
    id: 1,
    title: "Jazznacht am See",
    date: "2026-06-20",
    city: "Konstanz",
    category: "Konzert",
    price: 0,
  },
  {
    id: 2,
    title: "Techno Rave",
    date: "2026-11-19",
    city: "Freiburg",
    category: "Party",
    price: 8,
  },
  {
    id: 3,
    title: "Semesterparty HTWG",
    date: "2026-07-05",
    city: "Konstanz",
    category: "Party",
    price: 5,
  },
];

const noFilters = {
  query: "",
  city: "",
  category: ALL_CATEGORIES,
  onlyFree: false,
};

describe("filterEvents", () => {
  it("gibt ohne Filter alle Events zurück", () => {
    expect(filterEvents(events, noFilters)).toHaveLength(3);
  });

  it("filtert nach Suchbegriff im Titel", () => {
    const result = filterEvents(events, { ...noFilters, query: "jazz" });
    expect(result.map((e) => e.id)).toEqual([1]);
  });

  it("filtert nach Stadt", () => {
    const result = filterEvents(events, { ...noFilters, city: "konstanz" });
    expect(result).toHaveLength(2);
  });

  it("filtert nach Kategorie", () => {
    const result = filterEvents(events, { ...noFilters, category: "Party" });
    expect(result.map((e) => e.id)).toEqual([2, 3]);
  });

  it("zeigt mit 'nur kostenlos' nur Events ohne Preis", () => {
    const result = filterEvents(events, { ...noFilters, onlyFree: true });
    expect(result.map((e) => e.id)).toEqual([1]);
  });
});

describe("sortEvents", () => {
  it("sortiert nach Datum", () => {
    expect(sortEvents(events, "datum").map((e) => e.id)).toEqual([1, 3, 2]);
  });

  it("sortiert nach Preis", () => {
    expect(sortEvents(events, "preis").map((e) => e.id)).toEqual([1, 3, 2]);
  });

  it("sortiert nach Titel", () => {
    expect(sortEvents(events, "titel").map((e) => e.title)).toEqual([
      "Jazznacht am See",
      "Semesterparty HTWG",
      "Techno Rave",
    ]);
  });

  it("verändert das ursprüngliche Array nicht", () => {
    const before = events.map((e) => e.id);
    sortEvents(events, "titel");
    expect(events.map((e) => e.id)).toEqual(before);
  });
});
