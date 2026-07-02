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

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  async get(id: string | number) {
    return await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  async incrementTokenVersion(id: number): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { tokenVersion: { increment: 1 } }
    });
  }
}
