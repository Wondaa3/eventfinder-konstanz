import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EventList from "./EventList";

describe("EventList", () => {
  it("zeigt einen Hinweis, wenn keine Events da sind", () => {
    render(
      <MemoryRouter>
        <EventList events={[]} />
      </MemoryRouter>
    );
    expect(screen.getByText("Keine Events gefunden.")).toBeInTheDocument();
  });
});
