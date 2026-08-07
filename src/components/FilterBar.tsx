import CategoryChips from "./CategoryChips";
import type { SortOption } from "../utils/eventFilter";

interface FilterBarProps {
  query: string;
  city: string;
  category: string;
  onlyFree: boolean;
  sort: SortOption;
  onQueryChange: (query: string) => void;
  onCityChange: (city: string) => void;
  onCategoryChange: (category: string) => void;
  onOnlyFreeChange: (onlyFree: boolean) => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
}

function FilterBar({
  query,
  city,
  category,
  onlyFree,
  sort,
  onQueryChange,
  onCityChange,
  onCategoryChange,
  onOnlyFreeChange,
  onSortChange,
  onReset,
}: FilterBarProps) {
  return (
    <form className="filter-bar" onSubmit={(e) => e.preventDefault()}>
      <div className="filter-row">
        <div className="filter-field">
          <label htmlFor="suchbegriff">Was suchst du?</label>
          <input
            type="search"
            id="suchbegriff"
            placeholder="z.B. Konzert, Party..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="stadt">Stadt</label>
          <input
            type="text"
            id="stadt"
            placeholder="z.B. Berlin, Konstanz..."
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="sortierung">Sortieren nach</label>
          <select
            id="sortierung"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            <option value="datum">Datum</option>
            <option value="preis">Preis</option>
            <option value="titel">Titel</option>
          </select>
        </div>
      </div>

      <CategoryChips value={category} onChange={onCategoryChange} />

      <div className="filter-row bottom">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={onlyFree}
            onChange={(e) => onOnlyFreeChange(e.target.checked)}
          />
          Nur kostenlose Events
        </label>

        <button type="button" className="secondary" onClick={onReset}>
          Filter zurücksetzen
        </button>
      </div>
    </form>
  );
}

export default FilterBar;
