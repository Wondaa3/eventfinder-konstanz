# LatePass

Web-App, mit der man Events in ganz Deutschland findet, sich dafür anmeldet und
eigene einträgt. Auf der Startseite zeigt eine Heatmap, wo gerade viel los ist.

Team: Leon Pluto (315232), Jasmin Tran (315152), Niklas Sarbasini (315233)
Repository: https://github.com/Wondaa3/eventfinder-konstanz.git

## Starten

Gebraucht wird Node 20 oder neuer. Backend und Frontend laufen in zwei Terminals.

Backend (Express + SQLite):

```bash
cd backend
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run db:push          # legt die Tabellen an
npm run seed             # Demo-Events und Testnutzer
npm run dev
```



Frontend (Vite + React), im Hauptordner:

```bash
npm install
npm run dev
```

Die App läuft dann auf http://localhost:5173, die API auf http://localhost:3000.
Tests laufen mit `npm test`.




