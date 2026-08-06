import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import EventCard from "./EventCard";
import { renderWithProviders } from "../test/renderWithProviders";
import type { EventItem } from "../types";

const event: EventItem = {
  id: 1,
  title: "Jazznacht am See",
  date: "2026-06-20",
  time: "20:00",
  city: "Konstanz",
  category: "Konzert",
  price: 0,
  description: "Livemusik am Bodensee",
};

describe("EventCard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("zeigt Titel und Kategorie", () => {
    renderWithProviders(<EventCard event={event} />);
    expect(screen.getByText("Jazznacht am See")).toBeInTheDocument();
    expect(screen.getByText("Konzert")).toBeInTheDocument();
  });

  it("zeigt 'kostenlos' bei Preis 0", () => {
    renderWithProviders(<EventCard event={event} />);
    expect(screen.getByText(/kostenlos/)).toBeInTheDocument();
  });

  it("zeigt das Datum in deutscher Schreibweise", () => {
    renderWithProviders(<EventCard event={event} />);
    expect(screen.getByText(/20\. Juni 2026/)).toBeInTheDocument();
  });

  it("verlinkt auf die Detailseite", () => {
    renderWithProviders(<EventCard event={event} />);
    expect(screen.getByRole("link", { name: "Details" })).toHaveAttribute(
      "href",
      "/events/1"
    );
  });

  it("merkt das Event beim Klick auf den Stern vor", () => {
    renderWithProviders(<EventCard event={event} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Jazznacht am See zu Favoriten hinzufügen" })
    );

    expect(
      screen.getByRole("button", { name: "Jazznacht am See aus Favoriten entfernen" })
    ).toBeInTheDocument();
  });
});
