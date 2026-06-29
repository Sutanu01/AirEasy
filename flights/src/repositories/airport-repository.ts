import CrudRepository from "./crud-repository.js";
import { prisma } from "../config/index.js";
import type { Airport, Prisma } from "@prisma/client";

export default class AirportRepository extends CrudRepository<
  Airport,
  Prisma.AirportUncheckedCreateInput,
  Prisma.AirportWhereUniqueInput,
  Prisma.AirportFindManyArgs,
  Prisma.AirportUncheckedUpdateInput
> {
  constructor() {
    super(prisma.airport);
  }
}
