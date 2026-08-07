import { useState } from "react";
import LocationPicker from "./LocationPicker";
import { categories, type Category, type EventItem } from "../types";

export interface NewEvent {
  title: string;
  date: string;
  time: string;
  city: string;
  category: string;
  price: number;
  description: string;
  lat: number | null;
  lng: number | null;
}

interface AddEventFormProps {
  onAdd: (event: NewEvent) => void;
  initialEvent?: EventItem;
  submitLabel?: string;
  heading?: string;
}

function AddEventForm({
  onAdd,
  initialEvent,
  submitLabel = "Event hinzufügen",
  heading = "Eigenes Event eintragen",
}: AddEventFormProps) {
  const [title, setTitle] = useState(initialEvent?.title ?? "");
  const [date, setDate] = useState(initialEvent?.date ?? "");
  const [time, setTime] = useState(initialEvent?.time ?? "");
  const [city, setCity] = useState(initialEvent?.city ?? "");
  const [category, setCategory] = useState<Category>(
    (initialEvent?.category as Category) ?? "Konzert"
  );
  const [price, setPrice] = useState(
    initialEvent && initialEvent.price > 0 ? String(initialEvent.price) : ""
  );
  const [description, setDescription] = useState(initialEvent?.description ?? "");
  const [lat, setLat] = useState(initialEvent?.lat != null ? String(initialEvent.lat) : "");
  const [lng, setLng] = useState(initialEvent?.lng != null ? String(initialEvent.lng) : "");
  const [hint, setHint] = useState("");

  const titleLeft = 80 - title.length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !city.trim()) {
      setHint("Bitte mindestens Titel und Stadt ausfüllen.");
      return;
    }
    setHint("");

    onAdd({
      title: title.trim(),
      date: date.trim(),
      time: time.trim(),
      city: city.trim(),
      category,
      price: price === "" ? 0 : Number(price),
      description: description.trim(),
      lat: lat === "" ? null : Number(lat),
      lng: lng === "" ? null : Number(lng),
    });

    if (initialEvent) return;

    setTitle("");
    setDate("");
    setTime("");
    setCity("");
    setCategory("Konzert");
    setPrice("");
    setDescription("");
    setLat("");
    setLng("");
  }

  return (
    <div className="form-card wide">
      <h2>{heading}</h2>
      {hint && <p className="error">{hint}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="titel">Titel</label>
        <input
          type="text"
          id="titel"
          maxLength={80}
          placeholder="z.B. Jazznacht am See"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <small>{titleLeft} Zeichen übrig</small>

        <div className="form-row">
          <div>
            <label htmlFor="datum">Datum</label>
            <input
              type="date"
              id="datum"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="uhrzeit">Uhrzeit</label>
            <input
              type="time"
              id="uhrzeit"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

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

        <label htmlFor="beschreibung">Beschreibung</label>
        <textarea
          id="beschreibung"
          rows={4}
          placeholder="Was erwartet die Besucher?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <p className="feld-titel">Genauer Ort</p>
        <LocationPicker
          lat={lat}
          lng={lng}
          onPick={(pickedLat, pickedLng) => {
            setLat(String(pickedLat));
            setLng(String(pickedLng));
          }}
          onClear={() => {
            setLat("");
            setLng("");
          }}
        />

        <button type="submit">{submitLabel}</button>
      </form>
    </div>
  );
}

export default AddEventForm;
