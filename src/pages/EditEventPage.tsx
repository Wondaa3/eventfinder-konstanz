import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddEventForm, { type NewEvent } from "../components/AddEventForm";
import { apiFetch } from "../api";
import { useAuth } from "../auth/AuthContext";
import type { EventItem } from "../types";

function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<EventItem>(`/api/events/${id}`)
      .then((data) => setEvent(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave(changed: NewEvent) {
    setError("");
    try {
      await apiFetch(`/api/events/${id}`, {
        method: "PUT",
        token,
        body: JSON.stringify(changed),
      });
      navigate(`/events/${id}`);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <section>
      {loading && <p className="loading">Lädt...</p>}
      {error && <p className="error">{error}</p>}

      {event && (
        <AddEventForm
          onAdd={handleSave}
          initialEvent={event}
          heading="Event bearbeiten"
          submitLabel="Änderungen speichern"
        />
      )}
    </section>
  );
}

export default EditEventPage;
