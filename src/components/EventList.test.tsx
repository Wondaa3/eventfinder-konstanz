import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import EventList from "./EventList";
import { renderWithProviders } from "../test/renderWithProviders";
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
];

describe("EventList", () => {
  it("zeigt einen Hinweis, wenn keine Events da sind", () => {
    renderWithProviders(<EventList events={[]} />);
    expect(screen.getByText("Keine Events gefunden.")).toBeInTheDocument();
  });

  it("zeigt einen eigenen Hinweistext, wenn einer übergeben wird", () => {
    renderWithProviders(<EventList events={[]} emptyText="Noch keine Favoriten." />);
    expect(screen.getByText("Noch keine Favoriten.")).toBeInTheDocument();
  });

  it("rendert für jedes Event eine Karte", () => {
    renderWithProviders(<EventList events={events} />);
    expect(screen.getAllByRole("link", { name: "Details" })).toHaveLength(2);
  });
});
