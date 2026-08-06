import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

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

  // Start-Events, falls die Tabelle leer ist
  const count = await prisma.event.count();
  if (count === 0) {
    await prisma.event.createMany({
      data: [
        { title: "Jazznacht am See", date: "20. Juni", city: "Konstanz", category: "Konzert", price: 0 },
        { title: "Semesterparty HTWG", date: "5. Juli", city: "Konstanz", category: "Party", price: 5 },
        { title: "Open-Air Kino Berlin", date: "22. Juni", city: "Berlin", category: "Kino", price: 8 },
        { title: "Open-Air Festival", date: "14. Oktober", city: "Stuttgart", category: "Festival", price: 289 },
        { title: "Techno Rave", date: "19. November", city: "Freiburg im Breisgau", category: "Party", price: 8 },
      ],
    });
  }

  console.log("Seed fertig");
}

main().finally(() => prisma.$disconnect());
