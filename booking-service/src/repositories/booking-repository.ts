import CrudRepository from "./crud-repository.js";
import { prisma } from "../config/index.js";
import type { Booking, Prisma } from "@prisma/client";

export default class BookingRepository extends CrudRepository<
  Booking,
  Prisma.BookingCreateInput,
  Prisma.BookingWhereUniqueInput,
  Prisma.BookingFindManyArgs,
  Prisma.BookingUpdateInput
> {
  constructor() {
    super(prisma.booking);
  }
}
