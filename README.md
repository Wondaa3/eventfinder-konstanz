# LatePass

Eine Webanwendung, mit der man Veranstaltungen in ganz Deutschland findet, sich dafür anmeldet und eigene Termine einträgt.

**Team:** Leon Pluto (315232), Jasmin Tran (315152), Niklas Sarbasini (315233)
**Repository:** https://github.com/Wondaa3/eventfinder-konstanz.git
**Live-Version:** http://5.75.159.241:8080
**Demo-Video:** _Link folgt bzw. siehe Moodle-Abgabe_

## Was das Ganze soll

Die Idee ist im Alltag entstanden. Die meisten Partys, Konzerte oder Uni-Termine bekommen wir über Instagram-Storys oder Gruppenchats mit, und diese Infos verschwinden nach 24 Stunden wieder. Wer eine Story nicht rechtzeitig sieht, erfährt gar nicht, dass am Wochenende etwas stattgefunden hat. Genau darauf spielt auch der Name an: LatePass soll der späte Zugang zu Dingen sein, von denen man sonst zu spät erfährt.

Zielgruppe sind Studierende zwischen 18 und 30. Wir haben mit Konstanz angefangen und die App später auf ganz Deutschland ausgeweitet. Der Fokus liegt auf Konzerten, Partys, Kino, Festivals und Uni-Veranstaltungen.

## Was die App kann

Auf der Startseite gibt es eine Deutschlandkarte mit einer Heatmap, die zeigt, wo gerade viel los ist. Darunter kommt die Eventliste mit Suchfeld, Stadtfilter, Kategorie-Buttons, einer Option für nur kostenlose Events und einer Sortierung. Der Filterzustand landet in der URL, man kann also ein Filterergebnis einfach als Link weiterschicken.

Klick auf ein Event öffnet die Detailseite mit Beschreibung, dem genauen Ort auf einer Karte und einem Routen-Link. Wer angemeldet ist, kann sich zum Event anmelden, mit anderen Teilnehmern chatten und das Event als Favorit markieren.

Eingeloggte Nutzer können außerdem eigene Events eintragen, bearbeiten und wieder löschen. Der genaue Ort wird per Klick direkt auf der Karte gesetzt. Die Merkliste hängt am Konto und nicht am Browser, also sieht man auf jedem Gerät dieselbe Liste.

Insgesamt sind gerade 24 Demo-Events in zwölf Städten und vier Demo-Nutzer in der Datenbank, die ein Seed-Skript einspielt. Man kann also direkt nach dem Setup alles ausprobieren, ohne vorher etwas eintragen zu müssen.

## Architektur

LatePass besteht aus drei Teilen: einer Single-Page-Anwendung im Browser, einer REST-API auf dem Server und einer Datenbank dahinter. Das Frontend spricht ausschließlich mit der eigenen API und nie direkt mit der Datenbank. Die API ist die einzige Stelle, die entscheidet, wer was darf, und die einzige, die über Prisma mit der SQLite-Datenbank redet.

In der Entwicklung laufen zwei Prozesse: der Vite-Server auf Port 5173 und die Express-API auf Port 3000. Der Browser spricht dabei nur Port 5173 an, Vite leitet alle Anfragen, die mit `/api` anfangen, intern an Port 3000 weiter. Dadurch stehen im Code nur relative Adressen und es gibt keine CORS-Probleme. Auf dem Server läuft dagegen nur ein einziger Prozess, der neben der API auch das gebaute Frontend ausliefert.

Server-Side-Rendering brauchen wir nicht: LatePass ist eine interaktive App, ein großer Teil liegt hinter dem Login, und es gibt keine Inhalte, die für Suchmaschinen vorgerendert werden müssten.

Details zum API-Design, zum Datenbankschema und zur Ordnerstruktur stehen in der Ausarbeitung, Kapitel 3.

## Technologie-Stack

Im Frontend arbeiten wir mit **React 18** und **TypeScript**, gebaut mit **Vite**. Das Routing übernimmt **React Router 7**, für die Karte benutzen wir **Leaflet** zusammen mit **leaflet.heat** für die Heatmap. Kartenkacheln kommen von CARTO auf Basis von OpenStreetMap. Auf ein CSS-Framework haben wir bewusst verzichtet — das Stylesheet ist mit rund 930 Zeilen komplett von Hand geschrieben.

Das Backend ist ein **Node.js-Server mit Express**. Als Datenbank benutzen wir **SQLite über Prisma**, für die Passwörter **bcryptjs** mit Kostenfaktor 12, und die Authentifizierung läuft über **JWT** im Bearer-Header. Dazu kommen **helmet** für Sicherheitsheader, **cors** für die Freigabe des Frontend-Ports und **dotenv** für die Konfiguration.

Getestet wird mit **Vitest** und der **React Testing Library**, aktuell mit 24 Tests in fünf Dateien.

## Lokal starten

Gebraucht wird Node.js in Version 20 oder neuer. Backend und Frontend laufen in zwei getrennten Terminals.

**Terminal 1** im Backend-Ordner:

```bash
cd backend
npm install
cp .env.example .env       # Windows: copy .env.example .env
npm run db:push            # legt die Tabellen an
npm run seed               # spielt Demo-Events und Testnutzer ein
npm run dev
```

**Terminal 2** im Projekt-Root:

```bash
npm install
npm run dev
```

Danach läuft die App auf http://localhost:5173 und die API auf http://localhost:3000.

Tests laufen im Projekt-Root mit `npm test`. Der letzte Lauf vor der Abgabe hatte 24 Tests in 5 Dateien, alle grün, in etwa einer Sekunde.

## Testzugänge

Der Hauptzugang steht auch direkt unter dem Login-Formular:

- **`test@latepass.de`** · Passwort `test1234` — Hauptaccount für die Bewertung
- `lena@latepass.de`, `max@latepass.de`, `jonas@latepass.de` — dieselben Testnutzer, gleiches Passwort. Die sorgen dafür, dass Teilnehmerlisten und Chats nicht leer aussehen.

Alle Testnutzer werden vom Seed-Skript angelegt.

## Betrieb auf einem Server

Für den Server gibt es das Skript `deploy/package.sh`, das das Frontend baut, ins Backend kopiert und ein Archiv `latepass-server.tar.gz` schnürt. Das schiebt man per `scp` auf den Server, entpackt es, macht `npm install` im Backend und startet mit `npm start`. Wir benutzen `pm2`, damit der Prozess nach dem Schließen der SSH-Verbindung weiterläuft.

Wir haben die App auf einem Hetzner-VPS eingerichtet, sie ist öffentlich erreichbar unter **http://5.75.159.241:8080**. Eine öffentliche Erreichbarkeit ist laut Aufgabenstellung nicht verlangt, wir wollten es aber trotzdem einmal komplett durchziehen. Docker haben wir bewusst nicht eingesetzt — die Aufgabenstellung lässt als Alternative ein ausführliches README zu, und dieser Weg hat für uns besser gepasst.

## Bekannte Einschränkungen

Nach einem Reload ist man abgemeldet, weil das JWT bewusst nur im React-State liegt und nicht im localStorage. Der Chat läuft nicht in Echtzeit über WebSockets, sondern fragt alle zehn Sekunden nach neuen Nachrichten. Gefiltert und sortiert wird komplett im Browser — bei 24 Events ist das schneller als eine Serveranfrage, bei mehreren tausend Einträgen müsste das ins Backend wandern. Den genauen Ort setzt man per Klick auf die Karte, eine Adresssuche gibt es nicht. Bilder zu einzelnen Events kann man nicht hochladen, und das Feld `role` im User-Modell wird außer dem Standardwert nicht ausgewertet.

Automatisierte Backend-Tests haben wir nicht geschafft. Das ist die größte Lücke und sie ist uns bewusst. Sinnvoll wären Tests mit Supertest gegen eine eigene Testdatenbank, vor allem für die Berechtigungen und Statuscodes. Außerdem gibt es keine Ende-zu-Ende-Tests etwa mit Playwright.

## Sicherheit

Die `.env` liegt nicht im Repository, im Git steht nur eine Vorlage ohne echte Secrets. Passwörter werden nur als bcrypt-Hash gespeichert. Beim Login geben wir bei jedem Fehlschlag dieselbe Meldung zurück, egal ob die E-Mail nicht existiert oder das Passwort falsch war, damit man über die API nicht herausfinden kann, welche Adressen registriert sind. `helmet` setzt Sicherheitsheader inklusive einer Content-Security-Policy, die nur die Kartenkacheln als externe Quelle zulässt. SQL-Injection ist kein Thema, weil Prisma keine SQL-Strings selbst zusammenbaut. Für einen echten produktiven Betrieb müsste noch ein neues, zufälliges `JWT_SECRET` gesetzt, die Demo-Nutzer gelöscht und ein nginx mit HTTPS-Zertifikat davorgeschaltet werden.
