import { useEffect, useState } from "react";
import CategoryChips from "../components/CategoryChips";
import EventMap from "../components/EventMap";
import { apiFetch } from "../api";
import { ALL_CATEGORIES, filterEvents } from "../utils/eventFilter";
import type { EventItem } from "../types";

function MapPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<EventItem[]>("/api/events")
      .then((data) => setEvents(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const sichtbar = filterEvents(events, {
    query: "",
    city: "",
    category,
    onlyFree: false,
  });
  const mitOrt = sichtbar.filter((event) => event.lat != null && event.lng != null);

  return (
    <section>
      <div className="section-head">
        <h2>Eventkarte</h2>
        <p className="result-count">{mitOrt.length} Events auf der Karte</p>
      </div>

      <CategoryChips value={category} onChange={setCategory} />

      {loading && <p className="loading">Lädt...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <EventMap events={mitOrt} height="70vh" fitGermany withMarkers scrollZoom />
          <p className="hint">
            Rot heißt: hier finden viele Events statt. Reinzoomen zeigt die einzelnen Punkte –
            ein Klick darauf öffnet das Event.
          </p>
        </>
      )}
    </section>
  );
}

export default MapPage;
