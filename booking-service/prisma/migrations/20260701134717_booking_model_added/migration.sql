-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'booked', 'cancelled');

-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "flightId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "noOfSeats" INTEGER NOT NULL,
    "totalCost" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bookings_flightId_idx" ON "bookings"("flightId");
