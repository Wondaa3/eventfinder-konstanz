import type { EventItem } from "../types";

interface EventStatsProps {
  events: EventItem[];
}

function EventStats({ events }: EventStatsProps) {
  const cities = new Set(events.map((event) => event.city));
  const free = events.filter((event) => event.price === 0).length;

  return (
    <ul className="stats">
      <li>
        <strong>{events.length}</strong> Events
      </li>
      <li>
        <strong>{cities.size}</strong> Städte
      </li>
      <li>
        <strong>{free}</strong> kostenlos
      </li>
    </ul>
  );
}

export default EventStats;
