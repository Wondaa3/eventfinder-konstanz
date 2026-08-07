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
      {alle.map((category) => (
        <button
          key={category}
          type="button"
          className={value === category ? "chip active" : "chip"}
          aria-pressed={value === category}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryChips;
