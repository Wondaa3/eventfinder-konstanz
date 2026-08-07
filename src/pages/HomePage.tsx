import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import EventList from "../components/EventList";
import EventMap from "../components/EventMap";
import EventStats from "../components/EventStats";
import { apiFetch } from "../api";
import {
  ALL_CATEGORIES,
  filterEvents,
  sortEvents,
  type SortOption,
} from "../utils/eventFilter";
import type { EventItem } from "../types";

function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter stehen in der URL
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const city = searchParams.get("stadt") ?? "";
  const category = searchParams.get("kategorie") ?? ALL_CATEGORIES;
  const onlyFree = searchParams.get("gratis") === "1";
  const sort = (searchParams.get("sort") as SortOption) ?? "datum";

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  }

  useEffect(() => {
    setLoading(true);
    apiFetch<EventItem[]>("/api/events")
      .then((data) => setEvents(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const visibleEvents = sortEvents(
    filterEvents(events, { query, city, category, onlyFree }),
    sort
  );

  return (
    <>
      <section className="hero">
        <div className="hero-map">
          <EventMap
            events={events}
            height="100%"
            fitGermany
            interactive={false}
            heatRadius={16}
            heatBlur={12}
          />
        </div>

        <div className="hero-inhalt">
          <h1>Events in deiner Stadt</h1>
          <p>Finde Konzerte, Partys, Uni-Events und mehr – überall in Deutschland.</p>
          <EventStats events={events} />
          <p className="map-legende">
            <span className="legende-balken" /> wenige Events – viele Events
          </p>
        </div>
      </section>

      <section>
        <h2>Suche &amp; Filter</h2>
        <FilterBar
          query={query}
          city={city}
          category={category}
          onlyFree={onlyFree}
          sort={sort}
          onQueryChange={(value) => setParam("q", value)}
          onCityChange={(value) => setParam("stadt", value)}
          onCategoryChange={(value) =>
            setParam("kategorie", value === ALL_CATEGORIES ? "" : value)
          }
          onOnlyFreeChange={(value) => setParam("gratis", value ? "1" : "")}
          onSortChange={(value) => setParam("sort", value === "datum" ? "" : value)}
          onReset={() => setSearchParams({}, { replace: true })}
        />
      </section>

      <section>
        <div className="section-head">
          <h2>Aktuelle Events</h2>
          {!loading && !error && (
            <p className="result-count">
              {visibleEvents.length} von {events.length} Events
            </p>
          )}
        </div>

        {loading && <p className="loading">Lädt...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && <EventList events={visibleEvents} />}
      </section>
    </>
  );
}

export default HomePage;
