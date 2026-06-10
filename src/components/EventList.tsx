import type { EventItem } from "../types";
import EventCard from "./EventCard";

interface EventListProps {
  events: EventItem[];
}

// Rendert eine Liste von Events (VL 08: Listen mit map und key).
function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return <p className="empty-state">Keine Events gefunden.</p>;
  }

  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default EventList;
