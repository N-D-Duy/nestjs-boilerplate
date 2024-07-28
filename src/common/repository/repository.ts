export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T>;
  create(createDto: any): Promise<T>;
  update(id: string, updateDto: any): Promise<T>;
  delete(id: string): Promise<void>;
}