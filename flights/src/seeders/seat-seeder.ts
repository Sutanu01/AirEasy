import { prisma } from "../config/index.js";
import { SeatType } from "@prisma/client";

async function seedSeats() {
  console.log("Starting seats database seeding...");

  // 1. Clear existing seats to avoid duplicate conflicts
  console.log("Clearing existing seats...");
  await prisma.seat.deleteMany();

  // 2. Fetch all existing airplanes
  const airplanes = await prisma.airplane.findMany();
  if (airplanes.length === 0) {
    console.log("No airplanes found in the database. Please run the flight seeder first!");
    return;
  }

  const columns = ["A", "B", "C", "D", "E", "F"];
  console.log(`Seeding seat layouts for ${airplanes.length} airplanes...`);

  for (const airplane of airplanes) {
    const seatsToCreate = [];

    // Row 1: First Class (A, B, C, D)
    for (let i = 0; i < 4; i++) {
      seatsToCreate.push({
        airplaneId: airplane.id,
        row: 1,
        column: columns[i],
        seatType: SeatType.FIRST_CLASS,
      });
    }

    // Row 2: Business Class (A, B, C, D, E, F)
    for (const col of columns) {
      seatsToCreate.push({
        airplaneId: airplane.id,
        row: 2,
        column: col,
        seatType: SeatType.BUSINESS,
      });
    }

    // Row 3: Premium Economy (A, B, C, D, E, F)
    for (const col of columns) {
      seatsToCreate.push({
        airplaneId: airplane.id,
        row: 3,
        column: col,
        seatType: SeatType.PREMIUM_ECONOMY,
      });
    }

    // Rows 4 to 6: Economy Class (A, B, C, D, E, F)
    for (let r = 4; r <= 6; r++) {
      for (const col of columns) {
        seatsToCreate.push({
          airplaneId: airplane.id,
          row: r,
          column: col,
          seatType: SeatType.ECONOMY,
        });
      }
    }

    // Bulk insert the seats for this specific airplane
    await prisma.seat.createMany({
      data: seatsToCreate,
    });

    console.log(`Seeded ${seatsToCreate.length} seats for Airplane ID: ${airplane.id} (${airplane.modelNumber})`);
  }

  console.log("Seats database seeded successfully!");
}

seedSeats()
  .catch((e) => {
    console.error("Error seeding seats:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
