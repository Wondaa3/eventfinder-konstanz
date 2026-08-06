import { useState } from "react";
import type { Category } from "../types";

export interface NewEvent {
  title: string;
  date: string;
  city: string;
  category: string;
  price: number;
}

interface AddEventFormProps {
  onAdd: (event: NewEvent) => void;
}

const categories: Category[] = ["Konzert", "Party", "Kino", "Festival", "Uni"];

// Formular zum Anlegen eines neuen Events. Meldet die Daten per Callback nach oben.
function AddEventForm({ onAdd }: AddEventFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState<Category>("Konzert");
  const [price, setPrice] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !city.trim()) return;

    onAdd({
      title: title.trim(),
      date: date.trim() || "Datum folgt",
      city: city.trim(),
      category,
      price: price === "" ? 0 : Number(price),
    });

    setTitle("");
    setDate("");
    setCity("");
    setCategory("Konzert");
    setPrice("");
  }

  return (
    <div className="suche">
      <h2>Eigenes Event eintragen</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="titel">Titel</label>
        <input
          type="text"
          id="titel"
          placeholder="z.B. Jazznacht am See"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="datum">Datum</label>
        <input
          type="text"
          id="datum"
          placeholder="z.B. 20. Juni"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label htmlFor="event-stadt">Stadt</label>
        <input
          type="text"
          id="event-stadt"
          placeholder="z.B. Konstanz"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <label htmlFor="kategorie">Kategorie</label>
        <select
          id="kategorie"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label htmlFor="preis">Preis in € (leer = kostenlos)</label>
        <input
          type="number"
          id="preis"
          min="0"
          placeholder="z.B. 5"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button type="submit">Event hinzufügen</button>
      </form>
    </div>
  );
}

export default AddEventForm;
