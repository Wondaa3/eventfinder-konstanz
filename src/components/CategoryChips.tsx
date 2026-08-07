import { categories } from "../types";
import { ALL_CATEGORIES } from "../utils/eventFilter";

interface CategoryChipsProps {
  value: string;
  onChange: (category: string) => void;
}

function CategoryChips({ value, onChange }: CategoryChipsProps) {
  const alle = [ALL_CATEGORIES, ...categories];

  return (
    <div className="chip-row">
      {alle.map((category) => {
        const kategorieKlasse = `chip-${category.toLowerCase()}`;
        const aktiv = value === category;
        return (
          <button
            key={category}
            type="button"
            className={`chip ${kategorieKlasse}${aktiv ? " active" : ""}`}
            aria-pressed={aktiv}
            onClick={() => onChange(category)}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryChips;
