import { useAuth } from "../auth/AuthContext";
import { useFavorites } from "../favorites/FavoritesContext";

interface FavoriteButtonProps {
  eventId: number;
  title: string;
}

function FavoriteButton({ eventId, title }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!isAuthenticated) return null;

  const active = isFavorite(eventId);

  return (
    <button
      type="button"
      className={active ? "favorite-button active" : "favorite-button"}
      aria-pressed={active}
      aria-label={
        active ? `${title} aus Favoriten entfernen` : `${title} zu Favoriten hinzufügen`
      }
      onClick={() => toggleFavorite(eventId)}
    >
      {active ? "★" : "☆"}
    </button>
  );
}

export default FavoriteButton;
