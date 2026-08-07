import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EventChat from "../components/EventChat";
import EventMap from "../components/EventMap";
import FavoriteButton from "../components/FavoriteButton";
import SignupBox from "../components/SignupBox";
import { apiFetch } from "../api";
import { useAuth } from "../auth/AuthContext";
import { formatDate, formatPrice, isIsoDate } from "../utils/format";
import type { EventItem } from "../types";

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    apiFetch<EventItem>(`/api/events/${id}`)
      .then((data) => setEvent(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = !!user && !!event?.user && user.id === event.user.id;
  const hatOrt = !!event && event.lat != null && event.lng != null;

  async function handleDelete() {
    if (!confirm("Dieses Event wirklich löschen?")) return;
    try {
      await apiFetch(`/api/events/${id}`, { method: "DELETE", token });
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <section>
      <button type="button" className="secondary" onClick={() => navigate(-1)}>
        Zurück
      </button>

      {loading && <p className="loading">Lädt...</p>}
      {error && <p className="error">{error}</p>}

      {event && (
        <>
          <article className="detail-card">
            <div className="card-top">
              <span className={`badge badge-${event.category.toLowerCase()}`}>
                {event.category}
              </span>
              <FavoriteButton eventId={event.id} title={event.title} />
            </div>

            <h2>{event.title}</h2>

            <dl className="detail-list">
              <dt>Datum</dt>
              <dd>
                <time dateTime={isIsoDate(event.date) ? event.date : undefined}>
                  {formatDate(event.date)}
                </time>
                {event.time && ` um ${event.time} Uhr`}
              </dd>

              <dt>Stadt</dt>
              <dd>{event.city}</dd>

              <dt>Preis</dt>
              <dd>{formatPrice(event.price)}</dd>

              {event.user && (
                <>
                  <dt>Eingetragen von</dt>
                  <dd>{event.user.name}</dd>
                </>
              )}
            </dl>

            {event.description && <p className="detail-text">{event.description}</p>}

            {hatOrt && (
              <div className="detail-map">
                <div className="section-head">
                  <h3>Wo genau?</h3>
                  <a
                    className="button-link"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`}
                    target="_blank"
                    rel="noopener"
                  >
                    Route
                  </a>
                </div>
                <EventMap
                  events={[event]}
                  center={[event.lat as number, event.lng as number]}
                  zoom={15}
                  height="240px"
                  withHeat={false}
                  withMarkers
                />
              </div>
            )}

            {isOwner && (
              <div className="button-row">
                <Link className="button-link" to={`/events/${event.id}/bearbeiten`}>
                  Bearbeiten
                </Link>
                <button type="button" className="danger" onClick={handleDelete}>
                  Löschen
                </button>
              </div>
            )}
          </article>

          <div className="detail-columns">
            <SignupBox eventId={event.id} />
            <EventChat eventId={event.id} />
          </div>
        </>
      )}
    </section>
  );
}

export default EventDetailPage;
