import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="not-found">
      <p className="big">404</p>
      <h2>Seite nicht gefunden</h2>
      <p>Diese Seite gibt es nicht (mehr). Vielleicht war der Link veraltet.</p>
      <Link className="button-link" to="/">
        Zurück zur Startseite
      </Link>
    </section>
  );
}

export default NotFound;
