import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FavoritesProvider } from "../favorites/FavoritesContext";

// Komponenten mit Router und Favoriten-Context rendern,
// damit die Tests nicht jedes Mal alles selbst verschachteln müssen.
export function renderWithProviders(ui: ReactNode) {
  return render(
    <MemoryRouter>
      <FavoritesProvider>{ui}</FavoritesProvider>
    </MemoryRouter>
  );
}
