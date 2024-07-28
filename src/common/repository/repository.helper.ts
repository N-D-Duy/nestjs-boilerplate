import { Model, Document } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IRepository } from './repository';

@Injectable()
export abstract class Repository<T> implements IRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<T> {
    return this.model.findById(id).exec();
  }

  async create(createDto: any): Promise<T> {
    return this.model.create(createDto);
  }

  async update(id: string, updateDto: any): Promise<T> {
    return this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
