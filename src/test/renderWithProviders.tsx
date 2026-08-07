import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../auth/AuthContext";
import { FavoritesProvider } from "../favorites/FavoritesContext";

export function renderWithProviders(ui: ReactNode) {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <FavoritesProvider>{ui}</FavoritesProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}
