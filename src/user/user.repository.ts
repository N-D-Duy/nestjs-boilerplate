import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from "src/common/repository/repository.helper";
import { UserDocument } from "./schema/user.schema";
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends Repository<UserDocument> {
  constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) {
    super(userModel);
  }

  findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }
}