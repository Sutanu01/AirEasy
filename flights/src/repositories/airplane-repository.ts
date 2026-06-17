import CrudRepository from "./crud-repository.js";
import { prisma } from "../config/index.js";
import type { Airplane, Prisma } from "@prisma/client";

export default class AirplaneRepository extends CrudRepository<
  Airplane,
  Prisma.AirplaneCreateInput,
  Prisma.AirplaneWhereUniqueInput,
  Prisma.AirplaneFindManyArgs,
  Prisma.AirplaneUpdateInput
> {
  constructor() {
    super(prisma.airplane);
  }
}