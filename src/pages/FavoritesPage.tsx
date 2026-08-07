import EventList from "../components/EventList";
import { useFavorites } from "../favorites/FavoritesContext";

function FavoritesPage() {
  const { favorites, loading } = useFavorites();

  return (
    <section>
      <div className="section-head">
        <h2>Meine Favoriten</h2>
        <p className="result-count">{favorites.length} gemerkt</p>
      </div>

      <p className="hint">
        Deine Merkliste hängt an deinem Account – du siehst sie also auch auf einem anderen
        Gerät wieder.
      </p>

      {loading && <p className="loading">Lädt...</p>}
      {!loading && (
        <EventList
          events={favorites}
          emptyText="Noch keine Favoriten. Klick auf den Stern einer Karte."
        />
      )}
    </section>
  );
}

export default FavoritesPage;
