-- CreateTable
CREATE TABLE "airplanes" (
    "id" SERIAL NOT NULL,
    "modelNumber" TEXT NOT NULL DEFAULT '',
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "airplanes_pkey" PRIMARY KEY ("id")
);
