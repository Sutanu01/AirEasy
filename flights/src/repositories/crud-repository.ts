import { Logger } from "../config/index.js";
import type { CrudModel } from "./contracts/crud-model.js";

export default class CrudRepository<T, CreateInput = any, UniqueWhereInput = any, FindManyArgs = any, UpdateInput = any> {
  protected model: CrudModel<T, CreateInput, UniqueWhereInput, FindManyArgs, UpdateInput>;

  constructor(model: CrudModel<T, CreateInput, UniqueWhereInput, FindManyArgs, UpdateInput>) {
    this.model = model;
  }

  async create(data: CreateInput): Promise<T> {
    try {
      const response = await this.model.create({ data });
      return response;
    } catch (error) {
      Logger.error("Something went wrong in the CRUD Repo : CREATE");
      throw error;
    }
  }

  async delete(id: string | number): Promise<T> {
    try {
      const response = await this.model.delete({
        where: { id } as unknown as UniqueWhereInput,
      });
      return response;
    } catch (error) {
      Logger.error("Something went wrong in the CRUD Repo : DELETE");
      throw error;
    }
  }

  async get(id: string | number): Promise<T | null> {
    try {
      const response = await this.model.findUnique({
        where: { id } as unknown as UniqueWhereInput,
      });
      return response;
    } catch (error) {
      Logger.error("Something went wrong in the CRUD Repo : GET");
      throw error;
    }
  }

  async getAll(args?: FindManyArgs): Promise<T[]> {
    try {
      const response = await this.model.findMany(args);
      return response;
    } catch (error) {
      Logger.error("Something went wrong in the CRUD Repo : GET ALL");
      throw error;
    }
  }

  async update(id : string | number, data : UpdateInput):Promise<T> {
    try {
      const response = await this.model.update({
        where: { id } as unknown as UniqueWhereInput,
        data
      });
      return response;
    } catch (error) {
      Logger.error("Something went wrong in the CRUD Repo : UPDATE");
      throw error;
    }
  }
}
