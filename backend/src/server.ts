import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

const CATEGORIES = ["Konzert", "Party", "Kino", "Festival", "Uni"];

const eventInclude = {
  user: { select: { id: true, name: true } },
  _count: { select: { signups: true, messages: true } },
};

type WithCount = { _count: { signups: number; messages: number } };

function toEvent<T extends WithCount>(event: T) {
  const { _count, ...rest } = event;
  return { ...rest, signupCount: _count.signups, messageCount: _count.messages };
}

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

type JwtPayload = { userId: number; role: string };
interface AuthRequest extends Request {
  user?: JwtPayload;
}

function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Nicht authentifiziert" });
  }
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET) as JwtPayload;
    next();
  } catch {
    res.status(401).json({ error: "Token ungueltig oder abgelaufen" });
  }
}

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

type EventData = {
  title: string;
  date: string;
  time: string | null;
  city: string;
  category: string;
  price: number;
  description: string | null;
  lat: number | null;
  lng: number | null;
};

type CheckResult =
  | { ok: true; data: EventData }
  | { ok: false; status: number; error: string };

// Validierung für POST und PUT
function checkEventBody(body: Record<string, unknown>): CheckResult {
  const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

  const title = text(body.title);
  const city = text(body.city);
  const category = text(body.category);
  const date = text(body.date);
  const time = text(body.time);
  const description = text(body.description);
  const price = body.price === "" || body.price == null ? 0 : Number(body.price);
  const lat = body.lat == null || body.lat === "" ? null : Number(body.lat);
  const lng = body.lng == null || body.lng === "" ? null : Number(body.lng);

  if (!title || !city || !category) {
    return { ok: false, status: 400, error: "Titel, Stadt und Kategorie sind Pflicht" };
  }
  if (title.length > 80) {
    return { ok: false, status: 422, error: "Der Titel darf hoechstens 80 Zeichen lang sein" };
  }
  if (!CATEGORIES.includes(category)) {
    return { ok: false, status: 422, error: "Unbekannte Kategorie" };
  }
  if (!Number.isFinite(price) || price < 0) {
    return { ok: false, status: 422, error: "Der Preis muss 0 oder groesser sein" };
  }
  if (lat !== null && (!Number.isFinite(lat) || lat < -90 || lat > 90)) {
    return { ok: false, status: 422, error: "Ungueltige Koordinaten" };
  }
  if (lng !== null && (!Number.isFinite(lng) || lng < -180 || lng > 180)) {
    return { ok: false, status: 422, error: "Ungueltige Koordinaten" };
  }

  return {
    ok: true,
    data: {
      title,
      date: date || "Datum folgt",
      time: time || null,
      city,
      category,
      price: Math.round(price),
      description: description || null,
      lat,
      lng,
    },
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Registrierung
app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { email, name, password } = req.body as {
    email?: string;
    name?: string;
    password?: string;
  };
  if (!email || !name || !password) {
    return res.status(400).json({ error: "Alle Felder sind Pflicht" });
  }
  if (!email.includes("@")) {
    return res.status(422).json({ error: "Bitte eine gueltige E-Mail angeben" });
  }
  if (password.length < 8) {
    return res.status(422).json({ error: "Das Passwort braucht mindestens 8 Zeichen" });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "E-Mail bereits registriert" });
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, name, passwordHash },
    select: { id: true, email: true, name: true },
  });
  res.status(201).json(user);
});

// Login
app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };
  const user = email ? await prisma.user.findUnique({ where: { email } }) : null;
  const valid =
    user && password && (await bcrypt.compare(password, user.passwordHash));
  if (!valid) {
    return res.status(401).json({ error: "Ungültige Zugangsdaten" });
  }
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "2h",
  });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// eingeloggter Nutzer
app.get("/api/profile", requireAuth, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  if (!user) {
    return res.status(404).json({ error: "Nutzer nicht gefunden" });
  }
  res.json(user);
});

// eigene Events
app.get("/api/users/me/events", requireAuth, async (req: AuthRequest, res: Response) => {
  const events = await prisma.event.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: "desc" },
    include: eventInclude,
  });
  res.json(events.map(toEvent));
});

// gemerkte Events
app.get("/api/users/me/favorites", requireAuth, async (req: AuthRequest, res: Response) => {
  const favorites = await prisma.favorite.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: "desc" },
    include: { event: { include: eventInclude } },
  });
  res.json(favorites.map((favorite) => toEvent(favorite.event)));
});

// alle Events
app.get("/api/events", async (_req: Request, res: Response) => {
  const events = await prisma.event.findMany({
    orderBy: { id: "asc" },
    include: eventInclude,
  });
  res.json(events.map(toEvent));
});

// einzelnes Event
app.get("/api/events/:id", async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "Ungueltige ID" });
  }
  const event = await prisma.event.findUnique({ where: { id }, include: eventInclude });
  if (!event) {
    return res.status(404).json({ error: "Event nicht gefunden" });
  }
  res.json(toEvent(event));
});

// neues Event
app.post("/api/events", requireAuth, async (req: AuthRequest, res: Response) => {
  const check = checkEventBody(req.body ?? {});
  if (!check.ok) {
    return res.status(check.status).json({ error: check.error });
  }
  const event = await prisma.event.create({
    data: { ...check.data, userId: req.user!.userId },
    include: eventInclude,
  });
  res.status(201).location(`/api/events/${event.id}`).json(toEvent(event));
});

// Event ändern
app.put("/api/events/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "Ungueltige ID" });
  }
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: "Event nicht gefunden" });
  }
  if (existing.userId !== req.user!.userId) {
    return res.status(403).json({ error: "Nur eigene Events koennen geaendert werden" });
  }
  const check = checkEventBody(req.body ?? {});
  if (!check.ok) {
    return res.status(check.status).json({ error: check.error });
  }
  const event = await prisma.event.update({
    where: { id },
    data: check.data,
    include: eventInclude,
  });
  res.json(toEvent(event));
});

// Event löschen
app.delete("/api/events/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "Ungueltige ID" });
  }
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    return res.status(404).json({ error: "Event nicht gefunden" });
  }
  if (event.userId !== req.user!.userId) {
    return res.status(403).json({ error: "Nur eigene Events koennen geloescht werden" });
  }
  await prisma.event.delete({ where: { id } });
  res.status(204).end();
});

// prüft ID und ob es das Event gibt
async function findEventId(req: Request, res: Response) {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Ungueltige ID" });
    return null;
  }
  const event = await prisma.event.findUnique({ where: { id }, select: { id: true } });
  if (!event) {
    res.status(404).json({ error: "Event nicht gefunden" });
    return null;
  }
  return id;
}

// Event merken
app.post("/api/events/:id/favorite", requireAuth, async (req: AuthRequest, res: Response) => {
  const eventId = await findEventId(req, res);
  if (!eventId) return;

  const userId = req.user!.userId;
  const existing = await prisma.favorite.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });
  if (existing) {
    return res.status(409).json({ error: "Event ist bereits gemerkt" });
  }
  await prisma.favorite.create({ data: { userId, eventId } });
  res.status(201).json({ ok: true });
});

// Event vergessen
app.delete("/api/events/:id/favorite", requireAuth, async (req: AuthRequest, res: Response) => {
  const eventId = await findEventId(req, res);
  if (!eventId) return;

  await prisma.favorite.deleteMany({ where: { userId: req.user!.userId, eventId } });
  res.status(204).end();
});

// Teilnehmerliste
app.get("/api/events/:id/signups", async (req: Request, res: Response) => {
  const eventId = await findEventId(req, res);
  if (!eventId) return;

  const signups = await prisma.signup.findMany({
    where: { eventId },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { id: true, name: true } } },
  });
  res.json(signups.map((signup) => ({ id: signup.user.id, name: signup.user.name })));
});

// anmelden
app.post("/api/events/:id/signup", requireAuth, async (req: AuthRequest, res: Response) => {
  const eventId = await findEventId(req, res);
  if (!eventId) return;

  const userId = req.user!.userId;
  const existing = await prisma.signup.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });
  if (existing) {
    return res.status(409).json({ error: "Du bist schon angemeldet" });
  }
  await prisma.signup.create({ data: { userId, eventId } });
  res.status(201).json({ ok: true });
});

// abmelden
app.delete("/api/events/:id/signup", requireAuth, async (req: AuthRequest, res: Response) => {
  const eventId = await findEventId(req, res);
  if (!eventId) return;

  await prisma.signup.deleteMany({ where: { userId: req.user!.userId, eventId } });
  res.status(204).end();
});

// Chat lesen
app.get("/api/events/:id/messages", async (req: Request, res: Response) => {
  const eventId = await findEventId(req, res);
  if (!eventId) return;

  const messages = await prisma.message.findMany({
    where: { eventId },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { id: true, name: true } } },
  });
  res.json(messages);
});

// Chat schreiben
app.post("/api/events/:id/messages", requireAuth, async (req: AuthRequest, res: Response) => {
  const eventId = await findEventId(req, res);
  if (!eventId) return;

  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text) {
    return res.status(400).json({ error: "Die Nachricht darf nicht leer sein" });
  }
  if (text.length > 500) {
    return res.status(422).json({ error: "Die Nachricht darf hoechstens 500 Zeichen lang sein" });
  }
  const message = await prisma.message.create({
    data: { text, eventId, userId: req.user!.userId },
    include: { user: { select: { id: true, name: true } } },
  });
  res.status(201).json(message);
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Endpunkt nicht gefunden" });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Interner Serverfehler" });
});

app.listen(PORT, () => console.log(`API auf http://localhost:${PORT}`));
