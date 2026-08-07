import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiFetch } from "../api";
import { useAuth } from "../auth/AuthContext";
import type { EventItem } from "../types";

type FavoritesContextValue = {
  favorites: EventItem[];
  loading: boolean;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!token) {
      setFavorites([]);
      return;
    }
    setLoading(true);
    try {
      setFavorites(await apiFetch<EventItem[]>("/api/users/me/favorites", { token }));
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Beim Login laden, beim Logout leeren.
  useEffect(() => {
    load();
  }, [load]);

  async function toggleFavorite(id: number) {
    if (!isAuthenticated) return;
    const merken = !favorites.some((event) => event.id === id);
    await apiFetch(`/api/events/${id}/favorite`, {
      method: merken ? "POST" : "DELETE",
      token,
    });
    await load();
  }

  const value = useMemo(
    () => ({
      favorites,
      loading,
      isFavorite: (id: number) => favorites.some((event) => event.id === id),
      toggleFavorite,
    }),
    [favorites, loading, token, isAuthenticated]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites nur innerhalb von FavoritesProvider");
  return ctx;
}
