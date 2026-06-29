import CrudRepository from "./crud-repository.js";
import { prisma } from "../config/index.js";
import type { Flight, Prisma } from "@prisma/client";

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
}
