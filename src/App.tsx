import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import EventList from "./components/EventList";
import AddEventForm from "./components/AddEventForm";
import type { EventItem } from "./types";

// Beispieldaten aus dem M1-Prototyp (in M3 kommen die von einer API)
const startEvents: EventItem[] = [
  { id: 1, title: "Jazznacht am See", date: "20. Juni", city: "Konstanz", category: "Konzert", price: 0 },
  { id: 2, title: "Semesterparty HTWG", date: "5. Juli", city: "Konstanz", category: "Party", price: 5 },
  { id: 3, title: "Open-Air Kino Berlin", date: "22. Juni", city: "Berlin", category: "Kino", price: 8 },
  { id: 4, title: "Open-Air Festival", date: "14. Oktober", city: "Stuttgart", category: "Festival", price: 289 },
  { id: 5, title: "Techno Rave", date: "19. November", city: "Freiburg im Breisgau", category: "Party", price: 8 },
];

function App() {
  const [events, setEvents] = useState<EventItem[]>(startEvents);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");

  // Beim ersten Render: gespeicherte Events aus localStorage laden
  useEffect(() => {
    const saved = localStorage.getItem("latepass-events");
    if (saved) {
      setEvents(JSON.parse(saved));
    }
  }, []);

  // Bei jeder Änderung der Events: in localStorage sichern
  useEffect(() => {
    localStorage.setItem("latepass-events", JSON.stringify(events));
  }, [events]);

  // Abgeleiteter Wert, kein eigener State (Single Source of Truth)
  const visibleEvents = events.filter((event) => {
    const matchesQuery =
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.category.toLowerCase().includes(query.toLowerCase());
    const matchesCity = event.city.toLowerCase().includes(city.toLowerCase());
    return matchesQuery && matchesCity;
  });

  function handleAddEvent(event: EventItem) {
    setEvents((prev) => [...prev, event]);
  }

  return (
    <>
      <header>
        <h1>LatePass</h1>
        <nav>
          <a href="#suche">Suche</a>
          <a href="#events">Events</a>
          <a href="#neu">Event eintragen</a>
        </nav>
      </header>

      <main>
        <section id="suche">
          <SearchBar
            query={query}
            city={city}
            onQueryChange={setQuery}
            onCityChange={setCity}
          />
        </section>

        <section id="events">
          <h2>Aktuelle Events</h2>
          <EventList events={visibleEvents} />
        </section>

        <section id="neu">
          <AddEventForm onAdd={handleAddEvent} />
        </section>
      </main>

      <footer>
        <p>© 2026 LatePass</p>
        <nav>
          <a href="#">Impressum</a>
          <a href="#">Datenschutz</a>
        </nav>
      </footer>
    </>
  );
}

export default App;
