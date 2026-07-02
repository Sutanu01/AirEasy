import CrudRepository from "./crud-repository.js";
import { prisma } from "../config/index.js";
import type { Role, Prisma } from "@prisma/client";

export default class RoleRepository extends CrudRepository<
  Role,
  Prisma.RoleCreateInput,
  Prisma.RoleWhereUniqueInput,
  Prisma.RoleFindManyArgs,
  Prisma.RoleUpdateInput
> {
  constructor() {
    super(prisma.role);
  }

  async findByName(name: string): Promise<Role | null> {
    return await prisma.role.findUnique({
      where: { name }
    });
  }
}
