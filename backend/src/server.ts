import express from "express";
import cors from "cors";
import helmet from "helmet";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

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
  const user = await prisma.user.findUnique({ where: { email } });
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

// eingeloggter Nutzer (geschützt)
app.get("/api/profile", requireAuth, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, email: true, name: true, role: true },
  });
  res.json(user);
});

// alle Events
app.get("/api/events", async (_req: Request, res: Response) => {
  const events = await prisma.event.findMany({ orderBy: { id: "asc" } });
  res.json(events);
});

// einzelnes Event
app.get("/api/events/:id", async (req: Request, res: Response) => {
  const event = await prisma.event.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!event) {
    return res.status(404).json({ error: "Event nicht gefunden" });
  }
  res.json(event);
});

// neues Event anlegen (geschützt)
app.post("/api/events", requireAuth, async (req: AuthRequest, res: Response) => {
  const { title, date, city, category, price } = req.body as {
    title?: string;
    date?: string;
    city?: string;
    category?: string;
    price?: number;
  };
  if (!title || !city || !category) {
    return res.status(400).json({ error: "Titel, Stadt und Kategorie sind Pflicht" });
  }
  const event = await prisma.event.create({
    data: {
      title,
      date: date || "Datum folgt",
      city,
      category,
      price: price ? Number(price) : 0,
      userId: req.user!.userId,
    },
  });
  res.status(201).json(event);
});

// Event löschen (geschützt)
app.delete("/api/events/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    return res.status(404).json({ error: "Event nicht gefunden" });
  }
  await prisma.event.delete({ where: { id } });
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`API auf http://localhost:${PORT}`));
