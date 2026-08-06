import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterBar from "./FilterBar";
import { ALL_CATEGORIES } from "../utils/eventFilter";

function renderFilterBar(overrides: Partial<Parameters<typeof FilterBar>[0]> = {}) {
  const props = {
    query: "",
    city: "",
    category: ALL_CATEGORIES,
    onlyFree: false,
    sort: "datum" as const,
    onQueryChange: vi.fn(),
    onCityChange: vi.fn(),
    onCategoryChange: vi.fn(),
    onOnlyFreeChange: vi.fn(),
    onSortChange: vi.fn(),
    onReset: vi.fn(),
    ...overrides,
  };
  render(<FilterBar {...props} />);
  return props;
}

describe("FilterBar", () => {
  it("meldet die Eingabe im Suchfeld nach oben", () => {
    const props = renderFilterBar();

    fireEvent.change(screen.getByLabelText("Was suchst du?"), {
      target: { value: "Konzert" },
    });

    expect(props.onQueryChange).toHaveBeenCalledWith("Konzert");
  });

  it("meldet die gewählte Kategorie nach oben", () => {
    const props = renderFilterBar();

    fireEvent.click(screen.getByRole("button", { name: "Party" }));

    expect(props.onCategoryChange).toHaveBeenCalledWith("Party");
  });

  it("markiert die aktive Kategorie", () => {
    renderFilterBar({ category: "Kino" });

    expect(screen.getByRole("button", { name: "Kino" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("meldet den Kostenlos-Filter nach oben", () => {
    const props = renderFilterBar();

    fireEvent.click(screen.getByLabelText("Nur kostenlose Events"));

    expect(props.onOnlyFreeChange).toHaveBeenCalledWith(true);
  });
});
