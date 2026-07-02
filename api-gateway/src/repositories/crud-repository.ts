import { AppError } from "../utils/errors/app-error.js";
import type { CrudModel } from "./contracts/crud-model.js";
import { StatusCodes } from "http-status-codes";

export default class CrudRepository<T, CreateInput = any, UniqueWhereInput = any, FindManyArgs = any, UpdateInput = any> {
  protected model: CrudModel<T, CreateInput, UniqueWhereInput, FindManyArgs, UpdateInput>;

  constructor(model: CrudModel<T, CreateInput, UniqueWhereInput, FindManyArgs, UpdateInput>) {
    this.model = model;
  }

  async create(data: CreateInput): Promise<T> {
    const response = await this.model.create({ data });
    return response;
  }

  async delete(id: string | number): Promise<T> {
    const response = await this.model.delete({
      where: { id } as unknown as UniqueWhereInput,
    });
    if (!response) {
      throw new AppError("Not able to find the resource", StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async get(id: string | number): Promise<T | null> {
    const response = await this.model.findUnique({
      where: { id } as unknown as UniqueWhereInput,
    });
    if (!response) {
      throw new AppError("Not able to find the resource", StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async getAll(args?: FindManyArgs): Promise<T[]> {
    const response = await this.model.findMany(args);
    return response;
  }

  async update(id: string | number, data: UpdateInput): Promise<T> {
    const response = await this.model.update({
      where: { id } as unknown as UniqueWhereInput,
      data
    });
    if (!response) {
      throw new AppError("Not able to find the resource", StatusCodes.NOT_FOUND);
    }
    return response;
  }
}
