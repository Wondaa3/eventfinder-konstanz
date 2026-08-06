import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddEventForm, { type NewEvent } from "../components/AddEventForm";
import { apiFetch } from "../api";
import { useAuth } from "../auth/AuthContext";
import type { EventItem } from "../types";

function AddEventPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd(newEvent: NewEvent) {
    setError("");
    setSaving(true);
    try {
      const created = await apiFetch<EventItem>("/api/events", {
        method: "POST",
        token,
        body: JSON.stringify(newEvent),
      });
      navigate(`/events/${created.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      {error && <p className="error">{error}</p>}
      <AddEventForm
        onAdd={handleAdd}
        submitLabel={saving ? "Wird gespeichert..." : "Event hinzufügen"}
      />
    </section>
  );
}

export default AddEventPage;
