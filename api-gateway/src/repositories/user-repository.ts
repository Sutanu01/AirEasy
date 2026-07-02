import CrudRepository from "./crud-repository.js";
import { prisma } from "../config/index.js";
import type { User, Prisma } from "@prisma/client";

export default class UserRepository extends CrudRepository<
  User,
  Prisma.UserCreateInput,
  Prisma.UserWhereUniqueInput,
  Prisma.UserFindManyArgs,
  Prisma.UserUpdateInput
> {
  constructor() {
    super(prisma.user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async incrementTokenVersion(id: number): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { tokenVersion: { increment: 1 } }
    });
  }
}
