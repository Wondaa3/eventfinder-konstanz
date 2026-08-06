import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EventCard from "./EventCard";
import type { EventItem } from "../types";

const event: EventItem = {
  id: 1,
  title: "Jazznacht am See",
  date: "20. Juni",
  city: "Konstanz",
  category: "Konzert",
  price: 0,
};

describe("EventCard", () => {
  it("zeigt Titel und Kategorie", () => {
    render(
      <MemoryRouter>
        <EventCard event={event} />
      </MemoryRouter>
    );
    expect(screen.getByText("Jazznacht am See")).toBeInTheDocument();
    expect(screen.getByText("Konzert")).toBeInTheDocument();
  });

  it("zeigt 'kostenlos' bei Preis 0", () => {
    render(
      <MemoryRouter>
        <EventCard event={event} />
      </MemoryRouter>
    );
    expect(screen.getByText(/kostenlos/)).toBeInTheDocument();
  });

  it("verlinkt auf die Detailseite", () => {
    render(
      <MemoryRouter>
        <EventCard event={event} />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: "Details" })).toHaveAttribute(
      "href",
      "/events/1"
    );
  });
});
