import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AddEventForm from "./AddEventForm";

describe("AddEventForm", () => {
  it("meldet ein neues Event mit den eingegebenen Daten", () => {
    const onAdd = vi.fn();
    render(<AddEventForm onAdd={onAdd} />);

    fireEvent.change(screen.getByLabelText("Titel"), {
      target: { value: "Mein Konzert" },
    });
    fireEvent.change(screen.getByLabelText("Stadt"), {
      target: { value: "Konstanz" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Event hinzufügen" }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Mein Konzert", city: "Konstanz" })
    );
  });

  it("sendet nichts ab, wenn Titel und Stadt leer sind", () => {
    const onAdd = vi.fn();
    render(<AddEventForm onAdd={onAdd} />);

    fireEvent.click(screen.getByRole("button", { name: "Event hinzufügen" }));

    expect(onAdd).not.toHaveBeenCalled();
  });
});
