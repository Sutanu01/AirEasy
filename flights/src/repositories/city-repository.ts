import CrudRepository from "./crud-repository.js";
import { prisma } from "../config/index.js";
import type { City, Prisma } from "@prisma/client";

export default class CityRepository extends CrudRepository<
  City,
  Prisma.CityCreateInput,
  Prisma.CityWhereUniqueInput,
  Prisma.CityFindManyArgs,
  Prisma.CityUpdateInput
> {
  constructor() {
    super(prisma.city);
  }
}