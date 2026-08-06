import { Link } from "react-router-dom";
import type { EventItem } from "../types";

interface EventCardProps {
  event: EventItem;
}

// Zeigt ein einzelnes Event als Karte an.
function EventCard({ event }: EventCardProps) {
  const preis = event.price === 0 ? "kostenlos" : `${event.price} €`;

  return (
    <article className="event-card">
      <span className="badge">{event.category}</span>
      <h3>{event.title}</h3>
      <p>
        {event.date} · {event.city} · {preis}
      </p>
      <Link to={`/events/${event.id}`}>Details</Link>
    </article>
  );
}

export default EventCard;
