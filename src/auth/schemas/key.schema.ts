import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';


export type KeyDocument = HydratedDocument<Key>;

@Schema({timestamps: true})
export class Key {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  })
  userId: Types.ObjectId | User

  @Prop({ required: true })
  publicKey: string

  //just testing so I'd put private-key here
  @Prop({ required: true })
  privateKey: string

  @Prop({default: []})
  refreshToken: string[]
  
}

export const KeySchema = SchemaFactory.createForClass(Key);