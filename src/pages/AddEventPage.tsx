import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddEventForm, { type NewEvent } from "../components/AddEventForm";
import { useAuth } from "../auth/AuthContext";

function AddEventPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleAdd(event: NewEvent) {
    setError("");
    const res = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err.error || "Event konnte nicht gespeichert werden");
      return;
    }
    navigate("/");
  }

  return (
    <section>
      {error && <p className="error">{error}</p>}
      <AddEventForm onAdd={handleAdd} />
    </section>
  );
}

export default AddEventPage;
