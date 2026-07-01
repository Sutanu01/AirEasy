import CrudRepository from "./crud-repository.js";
import { prisma } from "../config/index.js";
import type { Flight, Seat, Prisma } from "@prisma/client";
import { AppError } from "../utils/errors/app-error.js";
import { StatusCodes } from "http-status-codes";

export default class FlightRepository extends CrudRepository<
  Flight,
  Prisma.FlightUncheckedCreateInput,
  Prisma.FlightWhereUniqueInput,
  Prisma.FlightFindManyArgs,
  Prisma.FlightUncheckedUpdateInput
> {
  constructor() {
    super(prisma.flight);
  }

  async getAllFlights(
    filter: Prisma.FlightWhereInput,
    sort?: Prisma.FlightFindManyArgs["orderBy"]
  ): Promise<Flight[]> {
    const response = await prisma.flight.findMany({
      where: filter,
      orderBy: sort,
      include: {
        airplane: {
          select: {
            modelNumber: true,
            capacity: true,
          },
        },
        departureAirport: {
          select: {
            airportName: true,
            airportCode: true,
            address: true,
          },
        },
        arrivalAirport: {
          select: {
            airportName: true,
            airportCode: true,
            address: true,
          },
        },
      },
    });
    return response;
  }

  async getFlight(id: number): Promise<Flight | null> {
    const response = await prisma.flight.findUnique({
      where: { id },
      include: {
        airplane: {
          select: {
            modelNumber: true,
            capacity: true,
          },
        },
        departureAirport: {
          select: {
            airportName: true,
            airportCode: true,
            address: true,
          },
        },
        arrivalAirport: {
          select: {
            airportName: true,
            airportCode: true,
            address: true,
          },
        },
      },
    });
    return response;
  }

  async updateRemainingSeats(
    flightId: number,
    seats: number,
    dec: boolean = true
  ): Promise<Flight> {
    const transaction = await prisma.$transaction(async (tx) => {

      const flight = await tx.flight.findUnique({
        where: { id: flightId },
      });

      if (!flight) {
        throw new AppError("The flight you requested to update seats for was not found", StatusCodes.NOT_FOUND);
      }

      if (dec) {
        try {
          return await tx.flight.update({
            where: {
              id: flightId,
              availableSeats: {
                gte: seats,
              },
            },
            data: {
              availableSeats: {
                decrement: seats,
              },
            },
          });
        } catch (error: any) {
          if (error.code === "P2025") {
            throw new AppError("Not enough seats available to book", StatusCodes.BAD_REQUEST);
          }
          throw error;
        }
      } else {
        const airplane = await tx.airplane.findUnique({
          where: { id: flight.airplaneId },
        });

        const maxCapacity = airplane ? airplane.capacity : Infinity;
        try {
          return await tx.flight.update({
            where: {
              id: flightId,
              availableSeats: {
                lte: maxCapacity - seats,
              },
            },
            data: {
              availableSeats: {
                increment: seats,
              },
            },
          });
        } catch (error: any) {
          if (error.code === "P2025") {
            throw new AppError("Cannot increment seats beyond airplane capacity", StatusCodes.BAD_REQUEST);
          }
          throw error;
        }
      }
    }, {
      maxWait: 5000,
      timeout: 10000,
    });

    return transaction;
  }

  async getFlightSeats(flightId: number): Promise<Seat[]> {
    const flight = await prisma.flight.findUnique({
      where: { id: flightId },
    });

    if (!flight) {
      throw new AppError("The flight you requested was not found", StatusCodes.NOT_FOUND);
    }

    const seats = await prisma.seat.findMany({
      where: { airplaneId: flight.airplaneId },
      orderBy: [
        { row: "asc" },
        { column: "asc" }
      ]
    });

    return seats;
  }
}

