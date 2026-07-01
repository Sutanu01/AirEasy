/*
  Warnings:

  - A unique constraint covering the columns `[pnr]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pnr` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "pnr" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_pnr_key" ON "bookings"("pnr");
