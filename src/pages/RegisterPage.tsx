import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err.error || "Registrierung fehlgeschlagen");
      return;
    }
    // direkt einloggen nach der Registrierung
    await login(email, password);
    navigate("/");
  }

  return (
    <section>
      <div className="suche">
        <h2>Registrieren</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="r-email">E-Mail</label>
          <input
            type="email"
            id="r-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="r-name">Name</label>
          <input
            type="text"
            id="r-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="r-passwort">Passwort</label>
          <input
            type="password"
            id="r-passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Konto erstellen</button>
        </form>
        <p>
          Schon ein Konto? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
