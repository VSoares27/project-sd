import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'dataCadastro', updatedAt: false } })
export class User {
  @Prop({ required: true, unique: true, index: true })
  userId: string; // AWS Cognito UserSub

  @Prop({ required: true })
  nome: string;

  @Prop({ required: true, unique: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
