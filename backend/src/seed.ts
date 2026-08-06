import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const demoEvents = [
  {
    title: "Jazznacht am See",
    date: "2026-06-20",
    time: "20:00",
    city: "Konstanz",
    category: "Konzert",
    price: 0,
    description:
      "Livemusik direkt am Bodensee. Drei Bands, freier Eintritt und Blick auf den Sonnenuntergang.",
  },
  {
    title: "Semesterparty HTWG",
    date: "2026-07-05",
    time: "22:00",
    city: "Konstanz",
    category: "Party",
    price: 5,
    description: "Die große Party zum Semesterende in der Mensa. Studiausweis nicht vergessen.",
  },
  {
    title: "Open-Air Kino Berlin",
    date: "2026-06-22",
    time: "21:30",
    city: "Berlin",
    category: "Kino",
    price: 8,
    description: "Filmklassiker unter freiem Himmel. Decke mitbringen, Popcorn gibt es vor Ort.",
  },
  {
    title: "Open-Air Festival",
    date: "2026-10-14",
    time: "14:00",
    city: "Stuttgart",
    category: "Festival",
    price: 289,
    description: "Drei Tage, vier Bühnen, über 40 Acts. Camping ist im Ticket enthalten.",
  },
  {
    title: "Techno Rave",
    date: "2026-11-19",
    time: "23:00",
    city: "Freiburg im Breisgau",
    category: "Party",
    price: 8,
    description: "Nachtschicht im alten Lagerhaus mit lokalen DJs.",
  },
  {
    title: "Ersti-Führung Campus",
    date: "2026-10-05",
    time: "10:00",
    city: "Konstanz",
    category: "Uni",
    price: 0,
    description: "Rundgang über den Campus für alle neuen Studierenden. Treffpunkt: Haupteingang.",
  },
  {
    title: "Poetry Slam im Kulturzentrum",
    date: "2026-09-12",
    time: "19:30",
    city: "Konstanz",
    category: "Konzert",
    price: 6,
    description: "Sechs Slammer, fünf Minuten Zeit, das Publikum entscheidet.",
  },
  {
    title: "Sommerkino am Rhein",
    date: "2026-08-08",
    time: "21:00",
    city: "Basel",
    category: "Kino",
    price: 12,
    description: "Aktuelle Filme auf der Großleinwand am Rheinufer.",
  },
  {
    title: "Hackathon Bodensee",
    date: "2026-11-07",
    time: "09:00",
    city: "Friedrichshafen",
    category: "Uni",
    price: 0,
    description: "24 Stunden coden im Team. Verpflegung und Schlafplatz sind gestellt.",
  },
];

async function main() {
  // Testuser anlegen (falls noch nicht da)
  const email = "test@latepass.de";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        name: "Test User",
        passwordHash: await bcrypt.hash("test1234", 12),
      },
    });
  }

  // Demo-Events anlegen bzw. aktualisieren. Selbst eingetragene Events bleiben erhalten.
  for (const event of demoEvents) {
    const found = await prisma.event.findFirst({ where: { title: event.title } });
    if (found) {
      await prisma.event.update({ where: { id: found.id }, data: event });
    } else {
      await prisma.event.create({ data: event });
    }
  }

  console.log(`Seed fertig (${demoEvents.length} Demo-Events)`);
}

main().finally(() => prisma.$disconnect());
