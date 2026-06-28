-- CreateTable
CREATE TABLE "airports" (
    "id" SERIAL NOT NULL,
    "airportName" TEXT NOT NULL,
    "airportCode" TEXT NOT NULL,
    "address" TEXT,
    "cityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "airports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "airports_airportName_key" ON "airports"("airportName");

-- CreateIndex
CREATE UNIQUE INDEX "airports_airportCode_key" ON "airports"("airportCode");

-- CreateIndex
CREATE INDEX "airports_cityId_idx" ON "airports"("cityId");

-- AddForeignKey
ALTER TABLE "airports" ADD CONSTRAINT "airports_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
