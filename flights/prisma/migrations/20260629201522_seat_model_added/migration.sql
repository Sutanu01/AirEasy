-- CreateEnum
CREATE TYPE "SeatType" AS ENUM ('first_class', 'business', 'premium_economy', 'economy');

-- CreateTable
CREATE TABLE "seats" (
    "id" SERIAL NOT NULL,
    "airplaneId" INTEGER NOT NULL,
    "row" INTEGER NOT NULL,
    "column" TEXT NOT NULL,
    "seatType" "SeatType" NOT NULL DEFAULT 'economy',

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "seats_airplaneId_idx" ON "seats"("airplaneId");

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_airplaneId_fkey" FOREIGN KEY ("airplaneId") REFERENCES "airplanes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
