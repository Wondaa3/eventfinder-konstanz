import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";
import { useAuth } from "../auth/AuthContext";
import type { Participant } from "../types";

interface SignupBoxProps {
  eventId: number;
}

function SignupBox({ eventId }: SignupBoxProps) {
  const { token, user, isAuthenticated } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setParticipants(await apiFetch<Participant[]>(`/api/events/${eventId}/signups`));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [eventId]);

  const angemeldet = !!user && participants.some((p) => p.id === user.id);

  async function handleClick() {
    setError("");
    try {
      await apiFetch(`/api/events/${eventId}/signup`, {
        method: angemeldet ? "DELETE" : "POST",
        token,
      });
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="box">
      <div className="section-head">
        <h3>Wer ist dabei?</h3>
        <span className="counter">{participants.length}</span>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Lädt...</p>}

      {!loading && participants.length === 0 && (
        <p className="hint">Noch niemand angemeldet. Sei der Erste!</p>
      )}

      {participants.length > 0 && (
        <ul className="people">
          {participants.map((person) => (
            <li key={person.id}>{person.name}</li>
          ))}
        </ul>
      )}

      {isAuthenticated ? (
        <button
          type="button"
          className={angemeldet ? "secondary" : ""}
          onClick={handleClick}
        >
          {angemeldet ? "Doch nicht dabei" : "Ich bin dabei"}
        </button>
      ) : (
        <p className="hint">
          <Link to="/login">Einloggen</Link>, um dich anzumelden.
        </p>
      )}
    </div>
  );
}

export default SignupBox;
