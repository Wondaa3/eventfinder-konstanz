# LatePass

Full-Stack-Webanwendung zum Finden und Eintragen von Events in ganz Deutschland — mit Kartenansicht, Heatmap, Merkliste, Anmeldung und Event-Chat.

**Team:** Leon Pluto (315232), Jasmin Tran (315152), Niklas Sarbasini (315233)
**Repository:** https://github.com/Wondaa3/eventfinder-konstanz.git
**Live-Version:** http://5.75.159.241:8080
**Demo-Video:** _(Link folgt / siehe Moodle-Abgabe)_

---

## Projektbeschreibung

LatePass ist im Alltag entstanden: Die meisten Partys, Konzerte oder Uni-Termine bekommen wir über Instagram-Storys oder Gruppenchats mit — und diese Informationen verschwinden schnell wieder. Wer eine Story nicht innerhalb von 24 Stunden sieht, erfährt gar nicht, dass am Wochenende etwas stattgefunden hat. **LatePass** soll der späte Zugang zu Dingen sein, von denen man sonst zu spät erfährt.

Zielgruppe sind Studierende zwischen 18 und 30 Jahren. Fokus liegt auf Konzerten, Partys, Kino, Festivals und Uni-Veranstaltungen. Die App funktioniert auf dem Handy, ein Konto braucht man erst zum Beitragen und auf einen Blick zeigt eine Heatmap, wo gerade viel los ist.

### Features

- Eventübersicht mit Suche, Stadt-, Kategorie-, Preis-Filter und Sortierung
- Deutschlandkarte mit **Heatmap**, die zeigt wo besonders viele Events stattfinden
- Detailseite pro Event mit Beschreibung, genauem Ort auf der Karte und Routen-Link
- **Registrierung** und **Login** mit gehashten Passwörtern und JWT
- Eigene Events **eintragen, bearbeiten und löschen**
- **Merkliste**, die am Benutzerkonto hängt (nicht am Browser)
- **Anmeldung** zu Events mit sichtbarer Teilnehmerliste
- **Chat** pro Event (Polling alle 10 Sekunden)
- **Profilseite** mit eigenen Daten und selbst eingetragenen Events

---

## Architekturübersicht

LatePass ist eine klassische **SPA + REST-API + Datenbank** Architektur:

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│                 │  HTTP   │                  │  Prisma │              │
│  React SPA      │ ──────► │  Express REST-   │ ──────► │  SQLite      │
│  (Browser)      │  fetch  │  API (Node.js)   │         │  (dev.db)    │
│                 │ /api/*  │                  │         │              │
└─────────────────┘         └──────────────────┘         └──────────────┘
   Vite Port 5173             Port 3000
   (Dev-Proxy an :3000)       (Auth: JWT im Bearer-Header)
```

- **Frontend** (React + TypeScript + Vite) spricht **ausschließlich** die eigene API unter `/api` an, niemals direkt die Datenbank.
- **Backend** (Express) prüft bei geschützten Endpunkten das JWT, ist die einzige Stelle die mit der Datenbank kommuniziert.
- **Datenbank** (SQLite via Prisma) mit 5 Modellen: `User`, `Event`, `Favorite`, `Signup`, `Message`.
- **Kein SSR/SSG:** LatePass ist eine interaktive App, ein großer Teil liegt hinter dem Login, und es gibt keine Inhalte die für Suchmaschinen vorgerendert werden müssten.
- **Auf dem Server** läuft alles in einem einzigen Prozess: Express liefert dort neben der API auch das gebaute Frontend aus.

Ausführliche Architektur, API-Design und Datenbankschema stehen in der Ausarbeitung (Kapitel 3).

---

## Technologie-Stack

| Bereich | Technologie | Wofür |
|---|---|---|
| Frontend | React 18 + TypeScript 5 | Komponenten, Zustand, Typsicherheit |
| Frontend | Vite 5 | Dev-Server & Build |
| Frontend | React Router 7 | Routing (SPA) |
| Frontend | Leaflet + leaflet.heat | Karte & Heatmap |
| Backend | Node.js 20+ / Express 4 | Server & Routen |
| Backend | Prisma 5 + SQLite | Datenmodell & DB |
| Backend | jsonwebtoken + bcryptjs | Token & Passwort-Hashing |
| Backend | helmet, cors, dotenv | Security-Header, CORS, Config |
| Testing | Vitest + React Testing Library | Unit- & Komponententests (24 Tests) |

---

## Setup — Lokal starten

**Voraussetzung:** Node.js **20 oder neuer** (`.nvmrc` liegt im Projekt).

Backend und Frontend laufen in **zwei getrennten Terminals**.

### Terminal 1 — Backend (Port 3000)

```bash
cd backend
npm install
cp .env.example .env       # Windows: copy .env.example .env
npm run db:push            # legt die Tabellen an
npm run seed               # spielt 24 Demo-Events + 4 Nutzer ein
npm run dev
```

### Terminal 2 — Frontend (Port 5173, im Projekt-Root)

```bash
npm install
npm run dev
```

App im Browser: **http://localhost:5173**
API: http://localhost:3000

### Tests

Im Projekt-Root:

```bash
npm test
```

Erwartetes Ergebnis: **24 Tests in 5 Dateien, alle grün** (~1 Sekunde).

---

## Testzugänge

Auf der Loginseite steht der Hauptzugang direkt unter dem Formular:

| E-Mail | Passwort | Rolle |
|---|---|---|
| `test@latepass.de` | `test1234` | Test-Account (empfohlen für Bewertung) |
| `lena@latepass.de` | `test1234` | Demo-Nutzer (macht Teilnehmerlisten voll) |
| `max@latepass.de` | `test1234` | Demo-Nutzer |
| `jonas@latepass.de` | `test1234` | Demo-Nutzer |

Alle Testnutzer werden vom Seed-Skript angelegt.

---

## Betrieb auf einem Server

Für den öffentlichen Betrieb erzeugt `deploy/package.sh` ein Paket:

```bash
./deploy/package.sh
scp latepass-server.tar.gz benutzer@SERVER:~
ssh benutzer@SERVER
tar -xzf latepass-server.tar.gz
cd latepass/backend && npm install && npm start
```

Auf dem Server läuft alles in **einem** Node-Prozess (Express liefert API + gebautes Frontend), `pm2` hält ihn am Leben. Aktueller Deploy: **http://5.75.159.241:8080** (Hetzner-VPS).

Docker-Compose ist bewusst nicht eingesetzt — die Aufgabenstellung erlaubt als Alternative ein ausführliches README, und dieser Weg hat für uns besser gepasst.

---

## Bekannte Einschränkungen & offene Punkte

- **Reload = Logout:** Das JWT liegt bewusst nur im React-State, nicht im `localStorage` (XSS-Schutz). Nach einem F5 muss man sich neu anmelden.
- **Chat via Polling:** Der Event-Chat fragt alle 10 Sekunden nach neuen Nachrichten — kein echter Echtzeit-Chat über WebSockets.
- **Filter/Sortierung im Browser:** Bei 24 Events schneller als eine Serveranfrage, würde bei mehreren tausend Einträgen ins Backend gehören.
- **Keine Adresssuche:** Den genauen Ort setzt man per Klick auf die Karte, es gibt kein Adress-Autocomplete (Geocoding).
- **Keine Bild-Uploads:** Events haben nur Text, Datum und Ort — keine Bilder.
- **Kein HTTPS auf dem Test-Server:** Für einen echten Betrieb wäre ein `nginx` mit Zertifikat davor nötig.
- **Keine Backend-Tests:** Aktuell nur Frontend/Utility-Tests (24 Stück). Sinnvoll wären zusätzlich API-Tests mit Supertest gegen eine Testdatenbank.
- **Feld `role`:** Ist im User-Modell vorhanden, wird aber außer dem Default nicht ausgewertet.

---

## Projektstruktur

```
eventfinder-konstanz/
├── src/                          Frontend (React + TS)
│   ├── main.tsx                  Einstiegspunkt (Router + Provider)
│   ├── App.tsx                   Routen
│   ├── api.ts                    zentrale fetch-Hilfsfunktion
│   ├── types.ts                  gemeinsame Typen
│   ├── auth/                     AuthContext (JWT + User)
│   ├── favorites/                FavoritesContext (Merkliste)
│   ├── components/               EventCard, EventList, FilterBar,
│   │                             EventMap, LocationPicker, ...
│   ├── pages/                    HomePage, MapPage, EventDetailPage,
│   │                             LoginPage, RegisterPage, ...
│   ├── utils/                    reine Funktionen (Filter, Sortierung)
│   └── test/                     Test-Setup + renderWithProviders
├── backend/                      Backend (Express + Prisma)
│   ├── src/server.ts             API-Endpunkte
│   ├── src/seed.ts               Demo-Daten
│   ├── prisma/schema.prisma      Datenmodell
│   └── .env.example              Konfigurations-Vorlage
├── public/                       statische Assets (Hero-Bilder)
├── Meilenstein 1/                statischer HTML/CSS-Prototyp aus M1
├── deploy/package.sh             Server-Auslieferungspaket
├── vite.config.ts                Vite + Proxy + Test-Setup
└── package.json
```

---

## Sicherheit

- `.env` liegt **nicht** im Repository (siehe `.gitignore`). Im Git steht nur `.env.example` als Vorlage ohne echtes Secret.
- Passwörter werden mit **bcryptjs** (Kostenfaktor 12) gehasht — nie im Klartext gespeichert.
- **JWT im `Authorization: Bearer`-Header**, nicht im localStorage.
- **`helmet`** setzt Security-Header inklusive Content-Security-Policy, die nur die Kartenkacheln als externe Quelle zulässt.
- **Keine SQL-Injection möglich**, weil Prisma keine SQL-Strings selbst zusammenbaut.
- Fehler-Meldungen bei Login unterscheiden nicht zwischen "E-Mail unbekannt" und "Passwort falsch" — verhindert Enumeration.
- Für produktiven Betrieb: `JWT_SECRET` zufällig setzen, Demo-Nutzer löschen, HTTPS via nginx davor.

---


