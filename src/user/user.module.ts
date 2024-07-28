import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { UserRepository } from './user.repository';
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserService, UserRepository]
})
export class UserModule { }