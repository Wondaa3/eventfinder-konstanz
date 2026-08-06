import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api";
import { useAuth } from "../auth/AuthContext";

function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, name, password }),
      });
      // direkt einloggen nach der Registrierung
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="form-card">
        <h2>Registrieren</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="r-email">E-Mail</label>
          <input
            type="email"
            id="r-email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="r-name">Name</label>
          <input
            type="text"
            id="r-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="r-passwort">Passwort</label>
          <input
            type="password"
            id="r-passwort"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <small>Mindestens 8 Zeichen</small>

          <button type="submit" disabled={loading}>
            {loading ? "Wird angelegt..." : "Konto erstellen"}
          </button>
        </form>

        <p>
          Schon ein Konto? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
