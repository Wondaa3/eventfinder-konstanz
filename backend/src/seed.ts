import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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
    lat: 47.6603,
    lng: 9.1758,
  },
  {
    title: "Semesterparty HTWG",
    date: "2026-07-05",
    time: "22:00",
    city: "Konstanz",
    category: "Party",
    price: 5,
    description: "Die große Party zum Semesterende in der Mensa. Studiausweis nicht vergessen.",
    lat: 47.6689,
    lng: 9.1719,
  },
  {
    title: "Open-Air Kino Berlin",
    date: "2026-06-22",
    time: "21:30",
    city: "Berlin",
    category: "Kino",
    price: 8,
    description: "Filmklassiker unter freiem Himmel. Decke mitbringen, Popcorn gibt es vor Ort.",
    lat: 52.5163,
    lng: 13.4536,
  },
  {
    title: "Open-Air Festival",
    date: "2026-10-14",
    time: "14:00",
    city: "Stuttgart",
    category: "Festival",
    price: 289,
    description: "Drei Tage, vier Bühnen, über 40 Acts. Camping ist im Ticket enthalten.",
    lat: 48.7758,
    lng: 9.1829,
  },
  {
    title: "Techno Rave",
    date: "2026-11-19",
    time: "23:00",
    city: "Freiburg im Breisgau",
    category: "Party",
    price: 8,
    description: "Nachtschicht im alten Lagerhaus mit lokalen DJs.",
    lat: 47.999,
    lng: 7.8421,
  },
  {
    title: "Ersti-Führung Campus",
    date: "2026-10-05",
    time: "10:00",
    city: "Konstanz",
    category: "Uni",
    price: 0,
    description: "Rundgang über den Campus für alle neuen Studierenden. Treffpunkt: Haupteingang.",
    lat: 47.6712,
    lng: 9.1683,
  },
  {
    title: "Poetry Slam im Kulturzentrum",
    date: "2026-09-12",
    time: "19:30",
    city: "Konstanz",
    category: "Konzert",
    price: 6,
    description: "Sechs Slammer, fünf Minuten Zeit, das Publikum entscheidet.",
    lat: 47.6621,
    lng: 9.1812,
  },
  {
    title: "Sommerkino am Rhein",
    date: "2026-08-08",
    time: "21:00",
    city: "Basel",
    category: "Kino",
    price: 12,
    description: "Aktuelle Filme auf der Großleinwand am Rheinufer.",
    lat: 47.5596,
    lng: 7.5886,
  },
  {
    title: "Hackathon Bodensee",
    date: "2026-11-07",
    time: "09:00",
    city: "Friedrichshafen",
    category: "Uni",
    price: 0,
    description: "24 Stunden coden im Team. Verpflegung und Schlafplatz sind gestellt.",
    lat: 47.6541,
    lng: 9.4794,
  },
  {
    title: "Bodensee Sunset Party",
    date: "2026-07-25",
    time: "18:00",
    city: "Konstanz",
    category: "Party",
    price: 10,
    description: "Open Air am Hafen mit Sonnenuntergang, Cocktails und House.",
    lat: 47.6598,
    lng: 9.1785,
  },
  {
    title: "Clubnacht Friedrichshain",
    date: "2026-06-27",
    time: "23:30",
    city: "Berlin",
    category: "Party",
    price: 15,
    description: "Drei Floors, Techno und House bis zum Sonnenaufgang.",
    lat: 52.5111,
    lng: 13.455,
  },
  {
    title: "Indie-Konzert Kreuzberg",
    date: "2026-09-03",
    time: "20:00",
    city: "Berlin",
    category: "Konzert",
    price: 18,
    description: "Vier Indie-Bands aus Berlin in einem alten Umspannwerk.",
    lat: 52.4996,
    lng: 13.4184,
  },
  {
    title: "Studi-Filmabend HU",
    date: "2026-11-12",
    time: "19:00",
    city: "Berlin",
    category: "Uni",
    price: 0,
    description: "Filmabend im Hörsaal, organisiert von der Fachschaft.",
    lat: 52.5186,
    lng: 13.3934,
  },
  {
    title: "Sommerfest Olympiapark",
    date: "2026-07-18",
    time: "15:00",
    city: "München",
    category: "Festival",
    price: 25,
    description: "Musik, Foodtrucks und Feuerwerk im Olympiapark.",
    lat: 48.1755,
    lng: 11.5518,
  },
  {
    title: "Techno im Werksviertel",
    date: "2026-08-22",
    time: "23:00",
    city: "München",
    category: "Party",
    price: 14,
    description: "Clubnacht im Container-Viertel hinterm Ostbahnhof.",
    lat: 48.1268,
    lng: 11.6045,
  },
  {
    title: "Uni-Kino LMU",
    date: "2026-10-29",
    time: "20:00",
    city: "München",
    category: "Kino",
    price: 3,
    description: "Jeden Donnerstag ein Film im großen Hörsaal.",
    lat: 48.1508,
    lng: 11.5802,
  },
  {
    title: "Hafenkonzert",
    date: "2026-08-15",
    time: "19:00",
    city: "Hamburg",
    category: "Konzert",
    price: 22,
    description: "Konzert auf einem Ponton mitten im Hafen.",
    lat: 53.5413,
    lng: 9.9694,
  },
  {
    title: "Studentenparty St. Pauli",
    date: "2026-10-10",
    time: "22:00",
    city: "Hamburg",
    category: "Party",
    price: 7,
    description: "Semesterstart-Party auf drei Etagen, Eintritt mit Studiausweis günstiger.",
    lat: 53.5503,
    lng: 9.9637,
  },
  {
    title: "Rheinufer Open Air",
    date: "2026-07-11",
    time: "16:00",
    city: "Köln",
    category: "Festival",
    price: 39,
    description: "Ein Tag, zwei Bühnen, direkt am Rhein mit Blick auf den Dom.",
    lat: 50.9375,
    lng: 6.9702,
  },
  {
    title: "Kinoabend im Belgischen Viertel",
    date: "2026-09-26",
    time: "20:30",
    city: "Köln",
    category: "Kino",
    price: 9,
    description: "Kurzfilmabend im Hinterhofkino, danach Gespräch mit den Regisseuren.",
    lat: 50.9401,
    lng: 6.9364,
  },
  {
    title: "Kesselkonzert",
    date: "2026-09-19",
    time: "19:30",
    city: "Stuttgart",
    category: "Konzert",
    price: 16,
    description: "Nachwuchsbands im Kessel, präsentiert von der Uni-Musikgruppe.",
    lat: 48.7823,
    lng: 9.1771,
  },
  {
    title: "Karaoke-Nacht Südvorstadt",
    date: "2026-08-29",
    time: "21:00",
    city: "Leipzig",
    category: "Party",
    price: 4,
    description: "Karaoke bis Mitternacht, jede Runde ein neues Duett.",
    lat: 51.3255,
    lng: 12.3731,
  },
  {
    title: "Skyline Filmnacht",
    date: "2026-07-31",
    time: "21:30",
    city: "Frankfurt am Main",
    category: "Kino",
    price: 11,
    description: "Kino auf dem Parkhausdach mit Blick auf die Hochhäuser.",
    lat: 50.1109,
    lng: 8.6821,
  },
  {
    title: "Elbufer Konzert",
    date: "2026-06-13",
    time: "18:30",
    city: "Dresden",
    category: "Konzert",
    price: 0,
    description: "Kostenloses Konzert auf den Elbwiesen, Picknick erlaubt.",
    lat: 51.0576,
    lng: 13.7452,
  },
];

const demoUsers = [
  { email: "test@latepass.de", name: "Test User" },
  { email: "lena@latepass.de", name: "Lena Vogt" },
  { email: "max@latepass.de", name: "Max Berger" },
  { email: "jonas@latepass.de", name: "Jonas Weber" },
];

const demoSignups = [
  { event: "Jazznacht am See", user: "lena@latepass.de" },
  { event: "Jazznacht am See", user: "max@latepass.de" },
  { event: "Jazznacht am See", user: "jonas@latepass.de" },
  { event: "Semesterparty HTWG", user: "lena@latepass.de" },
  { event: "Semesterparty HTWG", user: "max@latepass.de" },
  { event: "Clubnacht Friedrichshain", user: "jonas@latepass.de" },
  { event: "Bodensee Sunset Party", user: "lena@latepass.de" },
];

const demoMessages = [
  { event: "Jazznacht am See", user: "lena@latepass.de", text: "Geht jemand von euch hin?" },
  { event: "Jazznacht am See", user: "max@latepass.de", text: "Ja klar, ich bin dabei!" },
  {
    event: "Jazznacht am See",
    user: "jonas@latepass.de",
    text: "Treffen wir uns vorher am Hafen? So gegen 19 Uhr?",
  },
  { event: "Jazznacht am See", user: "lena@latepass.de", text: "Passt, bis dann." },
  {
    event: "Semesterparty HTWG",
    user: "max@latepass.de",
    text: "Weiß jemand, ob es Tickets an der Abendkasse gibt?",
  },
  {
    event: "Semesterparty HTWG",
    user: "lena@latepass.de",
    text: "Ja, letztes Mal gab es welche. Am besten früh da sein.",
  },
];

async function main() {
  for (const demoUser of demoUsers) {
    const existing = await prisma.user.findUnique({ where: { email: demoUser.email } });
    if (!existing) {
      await prisma.user.create({
        data: { ...demoUser, passwordHash: await bcrypt.hash("test1234", 12) },
      });
    }
  }

  // eigene Events bleiben erhalten
  for (const event of demoEvents) {
    const found = await prisma.event.findFirst({ where: { title: event.title } });
    if (found) {
      await prisma.event.update({ where: { id: found.id }, data: event });
    } else {
      await prisma.event.create({ data: event });
    }
  }

  for (const signup of demoSignups) {
    const event = await prisma.event.findFirst({ where: { title: signup.event } });
    const user = await prisma.user.findUnique({ where: { email: signup.user } });
    if (!event || !user) continue;
    const existing = await prisma.signup.findUnique({
      where: { userId_eventId: { userId: user.id, eventId: event.id } },
    });
    if (!existing) {
      await prisma.signup.create({ data: { userId: user.id, eventId: event.id } });
    }
  }

  for (const message of demoMessages) {
    const event = await prisma.event.findFirst({ where: { title: message.event } });
    const user = await prisma.user.findUnique({ where: { email: message.user } });
    if (!event || !user) continue;
    const existing = await prisma.message.findFirst({
      where: { eventId: event.id, userId: user.id, text: message.text },
    });
    if (!existing) {
      await prisma.message.create({
        data: { text: message.text, eventId: event.id, userId: user.id },
      });
    }
  }

  console.log(`Seed fertig (${demoEvents.length} Demo-Events, ${demoUsers.length} Nutzer)`);
}

main().finally(() => prisma.$disconnect());
