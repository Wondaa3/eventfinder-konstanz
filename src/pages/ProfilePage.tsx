import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventList from "../components/EventList";
import { apiFetch } from "../api";
import { useAuth } from "../auth/AuthContext";
import type { EventItem, Profile } from "../types";

function ProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [myEvents, setMyEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiFetch<Profile>("/api/profile", { token }),
      apiFetch<EventItem[]>("/api/users/me/events", { token }),
    ])
      .then(([profileData, eventsData]) => {
        setProfile(profileData);
        setMyEvents(eventsData);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <section>
      <h2>Mein Profil</h2>

      {loading && <p className="loading">Lädt...</p>}
      {error && <p className="error">{error}</p>}

      {profile && (
        <dl className="detail-list">
          <dt>Name</dt>
          <dd>{profile.name}</dd>
          <dt>E-Mail</dt>
          <dd>{profile.email}</dd>
          <dt>Rolle</dt>
          <dd>{profile.role}</dd>
        </dl>
      )}

      <div className="section-head">
        <h3>Meine Events ({myEvents.length})</h3>
        <Link className="button-link" to="/neu">
          Neues Event
        </Link>
      </div>

      {!loading && !error && (
        <EventList
          events={myEvents}
          emptyText="Du hast noch kein Event eingetragen."
        />
      )}
    </section>
  );
}

export default ProfilePage;
