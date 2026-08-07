import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import { formatDate, formatPrice, isIsoDate } from "../utils/format";
import type { EventItem } from "../types";

interface EventCardProps {
  event: EventItem;
}

function EventCard({ event }: EventCardProps) {
  return (
    <article className="event-card">
      <div className="card-top">
        <span className={`badge badge-${event.category.toLowerCase()}`}>
          {event.category}
        </span>
        <FavoriteButton eventId={event.id} title={event.title} />
      </div>

      <h3>{event.title}</h3>

      <p className="card-meta">
        <time dateTime={isIsoDate(event.date) ? event.date : undefined}>
          {formatDate(event.date)}
        </time>
        {event.time && <span> · {event.time} Uhr</span>}
      </p>
      <p className="card-meta">{event.city}</p>

      {event.description && <p className="card-text">{event.description}</p>}

      <p className={event.price === 0 ? "price free" : "price"}>
        {formatPrice(event.price)}
      </p>

      <p className="card-counts">
        <span title="Angemeldete Leute">{event.signupCount} dabei</span>
        <span title="Nachrichten im Chat">{event.messageCount} Nachrichten</span>
      </p>

      <Link className="button-link" to={`/events/${event.id}`}>
        Details
      </Link>
    </article>
  );
}

export default EventCard;
