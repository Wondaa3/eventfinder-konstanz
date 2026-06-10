# LatePass

**Team:** Leon Pluto (315232), Jasmin Tran (315152), Niklas Sarbasini (315233)
**Repository:** https://github.com/Wondaa3/eventfinder-konstanz.git

## Projektidee

LatePass ist eine Web-App für Studierende und junge Erwachsene, die lokale Events in ganz Deutschland schnell entdecken, filtern und sich dafür anmelden können. Nutzer können Veranstaltungen nach Kategorie, Stadt und Suchbegriff durchsuchen und eigene Events eintragen.

## Setup

```bash
npm install
npm run dev
```

Die App läuft dann unter http://localhost:5173.

## Kriterien-Zuordnung M2

npm + Vite: package.json und vite.config.ts im Projekt-Root

TypeScript: src/types.ts Z. 4-13 (Interface EventItem + Category), Props typisiert z.B. in src/components/EventCard.tsx Z. 3-5

Komponenten: src/components/ → SearchBar, EventList, EventCard, AddEventForm

Props-Übergabe: src/App.tsx Z. 60-74

useState: src/App.tsx Z. 17-19 (events- und Filter-State), AddEventForm.tsx Z. 14-18 (Formular)

useEffect: src/App.tsx Z. 22-27 (localStorage laden), Z. 30-32 (speichern)

Nutzeraktion: Suche filtert die Liste live, über das Formular kommt ein neues Event in die Liste

## Kriterien-Zuordnung M1

Der Prototyp aus M1 liegt im Ordner `Meilenstein 1/`.

Semantische HTML-Struktur: index.html Z. 11-66

Formular mit Labels: index.html Z. 27-34, login.html Z. 10-15

Responsives Layout (Flexbox/Grid): style.css Z. 39-73

Media Query: style.css Z. 127-131

URL-Struktur: index.html, events.html, login.html, suche.html
