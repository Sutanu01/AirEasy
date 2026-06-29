import { prisma } from "../config/index.js";

async function seed() {
  console.log("Starting database seeding...");

  // 1. Seed Airplanes
  console.log("Seeding Airplanes...");
  const airplaneData = [
    { modelNumber: "Airbus A320neo", capacity: 180 },
    { modelNumber: "Boeing 737-800", capacity: 189 },
    { modelNumber: "Boeing 777-300ER", capacity: 396 },
    { modelNumber: "ATR 72-600", capacity: 72 },
    { modelNumber: "Airbus A350-900", capacity: 315 },
    { modelNumber: "Airbus A321neo", capacity: 220 },
    { modelNumber: "Boeing 787-9 Dreamliner", capacity: 290 },
    { modelNumber: "Bombardier CRJ-700", capacity: 78 },
  ];

  const airplanes: any = {};
  for (const plane of airplaneData) {
    let airplane = await prisma.airplane.findFirst({ where: { modelNumber: plane.modelNumber } });
    if (!airplane) {
      airplane = await prisma.airplane.create({ data: plane });
    }
    airplanes[plane.modelNumber] = airplane;
  }

  // 2. Seed Cities
  console.log("Seeding Cities...");
  const citiesData = [
    "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata",
    "Pune", "Ahmedabad", "Kochi", "Jaipur", "Lucknow", "Guwahati"
  ];

  const cities: any = {};
  for (const cityName of citiesData) {
    const city = await prisma.city.upsert({
      where: { cityName },
      update: {},
      create: { cityName },
    });
    cities[cityName] = city;
  }

  // 3. Seed Airports
  console.log("Seeding Airports...");
  const airportsData = [
    {
      airportCode: "BOM",
      airportName: "Chhatrapati Shivaji Maharaj International Airport",
      address: "Sahar Road, Andheri East, Mumbai, Maharashtra 400099",
      cityName: "Mumbai",
    },
    {
      airportCode: "DEL",
      airportName: "Indira Gandhi International Airport",
      address: "New Delhi, Delhi 110037",
      cityName: "Delhi",
    },
    {
      airportCode: "BLR",
      airportName: "Kempegowda International Airport",
      address: "Devanahalli, Bengaluru, Karnataka 560300",
      cityName: "Bengaluru",
    },
    {
      airportCode: "HYD",
      airportName: "Rajiv Gandhi International Airport",
      address: "Shamshabad, Hyderabad, Telangana 500409",
      cityName: "Hyderabad",
    },
    {
      airportCode: "MAA",
      airportName: "Chennai International Airport",
      address: "Great Southern Trunk Rd, Meenambakkam, Chennai, Tamil Nadu 600027",
      cityName: "Chennai",
    },
    {
      airportCode: "CCU",
      airportName: "Netaji Subhash Chandra Bose International Airport",
      address: "Jessore Rd, Dum Dum, Kolkata, West Bengal 700052",
      cityName: "Kolkata",
    },
    {
      airportCode: "PNQ",
      airportName: "Pune Airport",
      address: "Lohegaon, Pune, Maharashtra 411032",
      cityName: "Pune",
    },
    {
      airportCode: "AMD",
      airportName: "Sardar Vallabhbhai Patel International Airport",
      address: "Hansol, Ahmedabad, Gujarat 380003",
      cityName: "Ahmedabad",
    },
    {
      airportCode: "COK",
      airportName: "Cochin International Airport",
      address: "Airport Rd, Kochi, Nedumbassery, Kerala 683111",
      cityName: "Kochi",
    },
    {
      airportCode: "JAI",
      airportName: "Jaipur International Airport",
      address: "Sanganer, Jaipur, Rajasthan 302029",
      cityName: "Jaipur",
    },
    {
      airportCode: "LKO",
      airportName: "Chaudhary Charan Singh International Airport",
      address: "Amausi, Lucknow, Uttar Pradesh 226009",
      cityName: "Lucknow",
    },
    {
      airportCode: "GAU",
      airportName: "Lokpriya Gopinath Bordoloi International Airport",
      address: "Borjhar, Guwahati, Assam 781015",
      cityName: "Guwahati",
    },
  ];

  const airports: any = {};
  for (const item of airportsData) {
    const airport = await prisma.airport.upsert({
      where: { airportCode: item.airportCode },
      update: {},
      create: {
        airportName: item.airportName,
        airportCode: item.airportCode,
        address: item.address,
        cityId: cities[item.cityName].id,
      },
    });
    airports[item.airportCode] = airport;
  }

  // 4. Seed Flights
  console.log("Seeding Flights...");
  const flightsData = [
    {
      flightNumber: "AI-101",
      departureTime: new Date("2026-07-01T06:00:00Z"),
      arrivalTime: new Date("2026-07-01T08:15:00Z"),
      departureCode: "BOM",
      arrivalCode: "DEL",
      airplaneModel: "Airbus A320neo",
      price: 5200,
      boardingGate: "Gate 12",
    },
    {
      flightNumber: "6E-202",
      departureTime: new Date("2026-07-01T09:30:00Z"),
      arrivalTime: new Date("2026-07-01T11:45:00Z"),
      departureCode: "DEL",
      arrivalCode: "BOM",
      airplaneModel: "Boeing 737-800",
      price: 4900,
      boardingGate: "Gate 4",
    },
    {
      flightNumber: "UK-303",
      departureTime: new Date("2026-07-02T10:00:00Z"),
      arrivalTime: new Date("2026-07-02T12:45:00Z"),
      departureCode: "BOM",
      arrivalCode: "BLR",
      airplaneModel: "Boeing 777-300ER",
      price: 3800,
      boardingGate: "Gate 8B",
    },
    {
      flightNumber: "AI-404",
      departureTime: new Date("2026-07-02T14:00:00Z"),
      arrivalTime: new Date("2026-07-02T16:50:00Z"),
      departureCode: "BLR",
      arrivalCode: "BOM",
      airplaneModel: "Boeing 777-300ER",
      price: 4100,
      boardingGate: "Gate 2A",
    },
    {
      flightNumber: "6E-505",
      departureTime: new Date("2026-07-03T07:15:00Z"),
      arrivalTime: new Date("2026-07-03T09:45:00Z"),
      departureCode: "DEL",
      arrivalCode: "BLR",
      airplaneModel: "Airbus A320neo",
      price: 6100,
      boardingGate: "Gate 15",
    },
    {
      flightNumber: "AI-606",
      departureTime: new Date("2026-07-03T11:00:00Z"),
      arrivalTime: new Date("2026-07-03T13:30:00Z"),
      departureCode: "BLR",
      arrivalCode: "DEL",
      airplaneModel: "Airbus A350-900",
      price: 5800,
      boardingGate: "Gate 11",
    },
    {
      flightNumber: "6E-707",
      departureTime: new Date("2026-07-04T08:00:00Z"),
      arrivalTime: new Date("2026-07-04T10:15:00Z"),
      departureCode: "HYD",
      arrivalCode: "BOM",
      airplaneModel: "ATR 72-600",
      price: 3400,
      boardingGate: "Gate 3",
    },
    {
      flightNumber: "UK-808",
      departureTime: new Date("2026-07-04T12:00:00Z"),
      arrivalTime: new Date("2026-07-04T14:30:00Z"),
      departureCode: "MAA",
      arrivalCode: "CCU",
      airplaneModel: "Boeing 737-800",
      price: 7200,
      boardingGate: "Gate 6",
    },
    {
      flightNumber: "AI-901",
      departureTime: new Date("2026-07-01T15:00:00Z"),
      arrivalTime: new Date("2026-07-01T16:15:00Z"),
      departureCode: "BOM",
      arrivalCode: "PNQ",
      airplaneModel: "ATR 72-600",
      price: 2100,
      boardingGate: "Gate 1A",
    },
    {
      flightNumber: "6E-902",
      departureTime: new Date("2026-07-01T18:00:00Z"),
      arrivalTime: new Date("2026-07-01T19:15:00Z"),
      departureCode: "PNQ",
      arrivalCode: "BOM",
      airplaneModel: "ATR 72-600",
      price: 2200,
      boardingGate: "Gate 2",
    },
    {
      flightNumber: "UK-903",
      departureTime: new Date("2026-07-02T06:30:00Z"),
      arrivalTime: new Date("2026-07-02T08:00:00Z"),
      departureCode: "DEL",
      arrivalCode: "AMD",
      airplaneModel: "Airbus A321neo",
      price: 3500,
      boardingGate: "Gate C1",
    },
    {
      flightNumber: "AI-904",
      departureTime: new Date("2026-07-02T09:00:00Z"),
      arrivalTime: new Date("2026-07-02T10:30:00Z"),
      departureCode: "AMD",
      arrivalCode: "DEL",
      airplaneModel: "Airbus A321neo",
      price: 3600,
      boardingGate: "Gate A3",
    },
    {
      flightNumber: "6E-905",
      departureTime: new Date("2026-07-02T16:00:00Z"),
      arrivalTime: new Date("2026-07-02T18:00:00Z"),
      departureCode: "BLR",
      arrivalCode: "COK",
      airplaneModel: "Airbus A320neo",
      price: 2900,
      boardingGate: "Gate 5",
    },
    {
      flightNumber: "UK-906",
      departureTime: new Date("2026-07-02T19:00:00Z"),
      arrivalTime: new Date("2026-07-02T21:00:00Z"),
      departureCode: "COK",
      arrivalCode: "BLR",
      airplaneModel: "Airbus A320neo",
      price: 2800,
      boardingGate: "Gate B2",
    },
    {
      flightNumber: "AI-907",
      departureTime: new Date("2026-07-03T10:30:00Z"),
      arrivalTime: new Date("2026-07-03T12:15:00Z"),
      departureCode: "DEL",
      arrivalCode: "JAI",
      airplaneModel: "ATR 72-600",
      price: 2400,
      boardingGate: "Gate 1",
    },
    {
      flightNumber: "6E-908",
      departureTime: new Date("2026-07-03T13:30:00Z"),
      arrivalTime: new Date("2026-07-03T15:15:00Z"),
      departureCode: "JAI",
      arrivalCode: "DEL",
      airplaneModel: "ATR 72-600",
      price: 2500,
      boardingGate: "Gate 3",
    },
    {
      flightNumber: "UK-909",
      departureTime: new Date("2026-07-03T14:00:00Z"),
      arrivalTime: new Date("2026-07-03T15:30:00Z"),
      departureCode: "DEL",
      arrivalCode: "LKO",
      airplaneModel: "Bombardier CRJ-700",
      price: 3100,
      boardingGate: "Gate 18",
    },
    {
      flightNumber: "AI-910",
      departureTime: new Date("2026-07-03T16:30:00Z"),
      arrivalTime: new Date("2026-07-03T18:00:00Z"),
      departureCode: "LKO",
      arrivalCode: "DEL",
      airplaneModel: "Bombardier CRJ-700",
      price: 3200,
      boardingGate: "Gate 2",
    },
    {
      flightNumber: "6E-911",
      departureTime: new Date("2026-07-04T05:00:00Z"),
      arrivalTime: new Date("2026-07-04T08:15:00Z"),
      departureCode: "CCU",
      arrivalCode: "GAU",
      airplaneModel: "Airbus A320neo",
      price: 3900,
      boardingGate: "Gate G4",
    },
    {
      flightNumber: "AI-912",
      departureTime: new Date("2026-07-04T09:15:00Z"),
      arrivalTime: new Date("2026-07-04T12:30:00Z"),
      departureCode: "GAU",
      arrivalCode: "CCU",
      airplaneModel: "Airbus A320neo",
      price: 3800,
      boardingGate: "Gate 1",
    },
    {
      flightNumber: "UK-913",
      departureTime: new Date("2026-07-04T15:00:00Z"),
      arrivalTime: new Date("2026-07-04T17:15:00Z"),
      departureCode: "BOM",
      arrivalCode: "HYD",
      airplaneModel: "Boeing 787-9 Dreamliner",
      price: 4600,
      boardingGate: "Gate 10",
    },
    {
      flightNumber: "AI-914",
      departureTime: new Date("2026-07-04T18:30:00Z"),
      arrivalTime: new Date("2026-07-04T20:45:00Z"),
      departureCode: "HYD",
      arrivalCode: "BOM",
      airplaneModel: "Boeing 787-9 Dreamliner",
      price: 4700,
      boardingGate: "Gate 5",
    },
    {
      flightNumber: "6E-915",
      departureTime: new Date("2026-07-05T06:00:00Z"),
      arrivalTime: new Date("2026-07-05T09:00:00Z"),
      departureCode: "MAA",
      arrivalCode: "DEL",
      airplaneModel: "Airbus A321neo",
      price: 5900,
      boardingGate: "Gate 7",
    },
    {
      flightNumber: "UK-916",
      departureTime: new Date("2026-07-05T10:00:00Z"),
      arrivalTime: new Date("2026-07-05T13:00:00Z"),
      departureCode: "DEL",
      arrivalCode: "MAA",
      airplaneModel: "Airbus A321neo",
      price: 6100,
      boardingGate: "Gate 14",
    },
  ];

  for (const item of flightsData) {
    const plane = airplanes[item.airplaneModel];
    const depAirport = airports[item.departureCode];
    const arrAirport = airports[item.arrivalCode];

    await prisma.flight.upsert({
      where: { flightNumber: item.flightNumber },
      update: {
        departureTime: item.departureTime,
        arrivalTime: item.arrivalTime,
        departureAirportId: depAirport.id,
        arrivalAirportId: arrAirport.id,
        airplaneId: plane.id,
        price: item.price,
        boardingGate: item.boardingGate,
        availableSeats: plane.capacity,
      },
      create: {
        flightNumber: item.flightNumber,
        departureTime: item.departureTime,
        arrivalTime: item.arrivalTime,
        departureAirportId: depAirport.id,
        arrivalAirportId: arrAirport.id,
        airplaneId: plane.id,
        price: item.price,
        boardingGate: item.boardingGate,
        availableSeats: plane.capacity,
      },
    });
  }

  console.log("Database seeded successfully!");
}

seed()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
