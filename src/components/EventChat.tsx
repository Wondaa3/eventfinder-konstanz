import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";
import { useAuth } from "../auth/AuthContext";
import type { ChatMessage } from "../types";

interface EventChatProps {
  eventId: number;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EventChat({ eventId }: EventChatProps) {
  const { token, user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setMessages(await apiFetch<ChatMessage[]>(`/api/events/${eventId}/messages`));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // alle 10 Sekunden neu laden
  useEffect(() => {
    load();
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, [eventId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setError("");
    try {
      await apiFetch(`/api/events/${eventId}/messages`, {
        method: "POST",
        token,
        body: JSON.stringify({ text }),
      });
      setText("");
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="box">
      <div className="section-head">
        <h3>Chat</h3>
        <span className="counter">{messages.length}</span>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Lädt...</p>}

      {!loading && messages.length === 0 && (
        <p className="hint">Noch keine Nachrichten. Schreib die erste.</p>
      )}

      {messages.length > 0 && (
        <ul className="chat">
          {messages.map((message) => (
            <li
              key={message.id}
              className={user && message.user.id === user.id ? "chat-message own" : "chat-message"}
            >
              <p className="chat-head">
                <strong>{message.user.name}</strong> · {formatTime(message.createdAt)}
              </p>
              <p className="chat-text">{message.text}</p>
            </li>
          ))}
        </ul>
      )}

      {isAuthenticated ? (
        <form className="chat-form" onSubmit={handleSubmit}>
          <label htmlFor="nachricht">Neue Nachricht</label>
          <input
            type="text"
            id="nachricht"
            maxLength={500}
            placeholder="Schreib etwas..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">Senden</button>
        </form>
      ) : (
        <p className="hint">
          <Link to="/login">Einloggen</Link>, um mitzuschreiben.
        </p>
      )}
    </div>
  );
}

export default EventChat;
