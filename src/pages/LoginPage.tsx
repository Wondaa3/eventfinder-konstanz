import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <section>
      <div className="suche">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="passwort">Passwort</label>
          <input
            type="password"
            id="passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Anmelden</button>
        </form>
        <p>
          Noch kein Konto? <Link to="/register">Registrieren</Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
