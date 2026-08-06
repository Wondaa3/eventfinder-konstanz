import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type FavoritesContextValue = {
  favorites: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
  clearFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const STORAGE_KEY = "latepass-favoriten";

function loadFavorites(): number[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? (JSON.parse(saved) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "number") : [];
  } catch {
    return [];
  }
}

// Merkliste: liegt im Context (viele Komponenten brauchen sie) und wird
// zusätzlich im localStorage gespeichert, damit sie einen Reload übersteht.
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>(loadFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(id: number) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((saved) => saved !== id) : [...prev, id]
    );
  }

  const value = useMemo(
    () => ({
      favorites,
      isFavorite: (id: number) => favorites.includes(id),
      toggleFavorite,
      clearFavorites: () => setFavorites([]),
    }),
    [favorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites nur innerhalb von FavoritesProvider");
  return ctx;
}
