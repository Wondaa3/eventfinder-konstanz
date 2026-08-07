    import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
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
  signupCount: 3,
  messageCount: 4,
};

describe("EventCard", () => {
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

  it("zeigt, wie viele dabei sind und wie viele Nachrichten es gibt", () => {
    renderWithProviders(<EventCard event={event} />);
    expect(screen.getByText("3 dabei")).toBeInTheDocument();
    expect(screen.getByText("4 Nachrichten")).toBeInTheDocument();
  });

  it("verlinkt auf die Detailseite", () => {
    renderWithProviders(<EventCard event={event} />);
    expect(screen.getByRole("link", { name: "Details" })).toHaveAttribute(
      "href",
      "/events/1"
    );
  });

  it("zeigt ohne Login keinen Favoriten-Stern", () => {
    renderWithProviders(<EventCard event={event} />);
    expect(
      screen.queryByRole("button", { name: /Favoriten/ })
    ).not.toBeInTheDocument();
  });
});
