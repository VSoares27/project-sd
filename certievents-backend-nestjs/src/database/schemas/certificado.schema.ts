import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CertificadoDocument = Certificado & Document;

@Schema({ timestamps: { createdAt: 'dataEmissao', updatedAt: false } })
export class Certificado {
  @Prop({ required: true, unique: true, index: true })
  certificadoId: string; // UUID

  @Prop({ required: true, index: true })
  userId: string; // AWS Cognito UserSub

  @Prop({ required: true })
  nomeEvento: string;

  @Prop({ required: true })
  urlS3: string;

  @Prop({ required: true, default: 'emitido' })
  status: string;
}

export const CertificadoSchema = SchemaFactory.createForClass(Certificado);
