# LatePass

**Team:** Leon Pluto (315232), Jasmin Tran (315152), Niklas Sarbasini (315233)
**Repository:** https://github.com/Wondaa3/eventfinder-konstanz.git

## Projektidee

LatePass ist eine Web-App für Studierende und junge Erwachsene, die lokale Events in ganz Deutschland schnell entdecken, filtern und sich dafür anmelden können. Nutzer können Veranstaltungen nach Kategorie, Stadt und Suchbegriff durchsuchen und eigene Events eintragen.

## Setup

Gebraucht wird **Node 20 oder neuer** (getestet mit 20, 22 und 24), sonst nichts.
Läuft auf macOS (Intel und Apple Silicon), Windows und Linux gleichermaßen –
es sind keine Pakete dabei, die beim Installieren kompiliert werden müssen.

**1. Backend** (Express + SQLite):

```bash
cd backend
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run setup               # legt die Tabellen an und füllt Demo-Daten ein
npm run dev                 # API auf http://localhost:3000
```

Ohne die Datei `.env` findet Prisma die Datenbank nicht – der Schritt ist Pflicht.
Die `.env` steht absichtlich nicht im Repo (sie enthält das JWT-Secret).

**2. Frontend** (Vite + React), im Projekt-Wurzelordner, zweites Terminal:

```bash
npm install
npm run dev                 # App auf http://localhost:5173
```

Tests laufen mit `npm test`.

Testzugang: `test@latepass.de` / `test1234`
(weitere Demo-Nutzer: `lena@`, `max@`, `jonas@latepass.de`, gleiches Passwort)

### Wenn `npm install` Probleme macht

- **Node-Version prüfen:** `node -v` muss 20 oder höher sein. Mit `nvm` reicht
  `nvm use` im Projektordner (die Version steht in `.nvmrc`).
- **Fehler wie „Cannot find module @rollup/rollup-…" oder „@esbuild/…":** Das
  passiert, wenn `node_modules` von einem anderen Rechner/Betriebssystem stammt.
  Lösung:

  ```bash
  rm -rf node_modules package-lock.json    # Windows: Ordner und Datei löschen
  npm install
  ```

- **`npm ci` vermeiden**, solange die Lockfile von einem anderen System kommt –
  `npm install` löst die passenden Pakete selbst auf.
- **`node_modules` niemals kopieren oder committen** (steht in `.gitignore`).
  Jeder installiert lokal, dann passt es auch auf ARM-Macs.
- **Prisma:** Nach `npm install` erzeugt Prisma automatisch den passenden Client
  für das eigene System. Falls doch mal eine Meldung dazu kommt, hilft
  `npx prisma generate` im Ordner `backend/`.

## Dokumentation

- [`MEILENSTEIN_3.md`](MEILENSTEIN_3.md) – Architektur und Kriterien für M3
- [`MEILENSTEIN_3_DETAILS.md`](MEILENSTEIN_3_DETAILS.md) – Erklärung Datei für Datei
- [`ERWEITERUNGEN.md`](ERWEITERUNGEN.md) – zusätzliche Features und Design danach


