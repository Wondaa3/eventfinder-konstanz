import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { EventItem } from "../types";

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/events/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Event nicht gefunden");
        return res.json();
      })
      .then((data) => setEvent(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <section>
      <button onClick={() => navigate(-1)}>Zurück</button>

      {loading && <p>Lädt...</p>}
      {error && <p className="error">{error}</p>}

      {event && (
        <div className="event-card">
          <span className="badge">{event.category}</span>
          <h2>{event.title}</h2>
          <p>Datum: {event.date}</p>
          <p>Stadt: {event.city}</p>
          <p>Preis: {event.price === 0 ? "kostenlos" : `${event.price} €`}</p>
        </div>
      )}
    </section>
  );
}

export default EventDetailPage;
