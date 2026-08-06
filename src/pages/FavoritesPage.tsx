import { useEffect, useState } from "react";
import EventList from "../components/EventList";
import { apiFetch } from "../api";
import { useFavorites } from "../favorites/FavoritesContext";
import type { EventItem } from "../types";

function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<EventItem[]>("/api/events")
      .then((data) => setEvents(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const savedEvents = events.filter((event) => favorites.includes(event.id));

  return (
    <section>
      <div className="section-head">
        <h2>Meine Favoriten</h2>
        {savedEvents.length > 0 && (
          <button type="button" className="secondary" onClick={clearFavorites}>
            Liste leeren
          </button>
        )}
      </div>

      <p className="hint">
        Favoriten werden im Browser gespeichert und bleiben auch nach einem Neuladen erhalten.
      </p>

      {loading && <p className="loading">Lädt...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <EventList
          events={savedEvents}
          emptyText="Noch keine Favoriten. Klick auf den Stern einer Karte."
        />
      )}
    </section>
  );
}

export default FavoritesPage;
