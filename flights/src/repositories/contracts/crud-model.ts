export interface CrudModel<T, CreateInput = any, UniqueWhereInput = any, FindManyArgs = any, UpdateInput = any> {
  create(args: { data: CreateInput }): Promise<T>;
  delete(args: { where: UniqueWhereInput }): Promise<T>;
  findUnique(args: { where: UniqueWhereInput }): Promise<T | null>;
  findMany(args?: FindManyArgs): Promise<T[]>;
  update(args: { where: UniqueWhereInput; data: UpdateInput }): Promise<T>;
}
