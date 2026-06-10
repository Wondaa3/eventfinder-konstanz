interface SearchBarProps {
  query: string;
  city: string;
  onQueryChange: (query: string) => void;
  onCityChange: (city: string) => void;
}

// Suchfeld + Stadtfeld als kontrollierte Inputs (VL 09).
// Der State liegt in App (lifting state up), damit die EventList ihn auch nutzen kann.
function SearchBar({ query, city, onQueryChange, onCityChange }: SearchBarProps) {
  return (
    <div className="suche">
      <h2>Events in deiner Stadt</h2>
      <p>Finde Konzerte, Partys, Uni-Events und mehr – überall in Deutschland.</p>

      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="suchbegriff">Was suchst du?</label>
        <input
          type="text"
          id="suchbegriff"
          placeholder="z.B. Konzert, Party..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />

        <label htmlFor="stadt">Stadt</label>
        <input
          type="text"
          id="stadt"
          placeholder="z.B. Berlin, Konstanz..."
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
        />
      </form>
    </div>
  );
}

export default SearchBar;
