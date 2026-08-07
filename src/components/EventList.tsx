import type { EventItem } from "../types";
import EventCard from "./EventCard";

interface EventListProps {
  events: EventItem[];
  emptyText?: string;
}

function EventList({ events, emptyText = "Keine Events gefunden." }: EventListProps) {
  if (events.length === 0) {
    return <p className="empty-state">{emptyText}</p>;
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
