import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/shared/helpers/role.enum';
import { Status } from 'src/shared/helpers/status.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User {
    @Prop({ required: true, max: 50, trim: true })
    username: string;
    @Prop({ required: true, trim: true })
    email: string;
    @Prop({ required: true })
    password: string;
    @Prop({ type: String, default: Role.USER, enum: Object.values(Role) })
    role: string;

    @Prop({ type: String, default: 'inactive', enum: Object.values(Status) })
    status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
