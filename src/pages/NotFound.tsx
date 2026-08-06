import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section>
      <h2>Seite nicht gefunden</h2>
      <Link to="/">Zurück zur Startseite</Link>
    </section>
  );
}

export default NotFound;
