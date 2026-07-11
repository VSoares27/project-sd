import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventoDocument = Evento & Document;

@Schema()
export class Evento {
  @Prop({ required: true, unique: true, index: true })
  id: string; // ex: 'demo-week', 'react-19'

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  organizer: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true, default: false })
  isOfficial: boolean;

  @Prop({ required: true })
  price: string;

  // Campos de detalhes do evento
  @Prop()
  descricao?: string;

  @Prop()
  instituicao?: string;

  @Prop()
  horario?: string;
}

export const EventoSchema = SchemaFactory.createForClass(Evento);
