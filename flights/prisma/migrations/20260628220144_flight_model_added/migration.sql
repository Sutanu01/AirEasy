-- CreateTable
CREATE TABLE "flights" (
    "id" SERIAL NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "airplaneId" INTEGER NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,
    "departureAirportId" INTEGER NOT NULL,
    "arrivalAirportId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "boardingGate" TEXT,
    "availableSeats" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "flights_flightNumber_key" ON "flights"("flightNumber");

-- CreateIndex
CREATE INDEX "flights_departureAirportId_idx" ON "flights"("departureAirportId");

-- CreateIndex
CREATE INDEX "flights_arrivalAirportId_idx" ON "flights"("arrivalAirportId");

-- CreateIndex
CREATE INDEX "flights_airplaneId_idx" ON "flights"("airplaneId");

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_airplaneId_fkey" FOREIGN KEY ("airplaneId") REFERENCES "airplanes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_departureAirportId_fkey" FOREIGN KEY ("departureAirportId") REFERENCES "airports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_arrivalAirportId_fkey" FOREIGN KEY ("arrivalAirportId") REFERENCES "airports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
