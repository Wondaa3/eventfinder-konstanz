import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import EventList from "../components/EventList";
import type { EventItem } from "../types";

function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");

  // Events vom Backend holen
  useEffect(() => {
    setLoading(true);
    fetch("/api/events")
      .then((res) => {
        if (!res.ok) throw new Error("Events konnten nicht geladen werden");
        return res.json();
      })
      .then((data) => setEvents(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const visibleEvents = events.filter((event) => {
    const matchesQuery =
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.category.toLowerCase().includes(query.toLowerCase());
    const matchesCity = event.city.toLowerCase().includes(city.toLowerCase());
    return matchesQuery && matchesCity;
  });

  return (
    <>
      <section>
        <SearchBar
          query={query}
          city={city}
          onQueryChange={setQuery}
          onCityChange={setCity}
        />
      </section>

      <section>
        <h2>Aktuelle Events</h2>
        {loading && <p>Lädt...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && <EventList events={visibleEvents} />}
      </section>
    </>
  );
}

export default HomePage;
