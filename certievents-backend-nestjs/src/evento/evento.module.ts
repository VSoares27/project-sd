import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventoController } from './evento.controller';
import { EventoService } from './evento.service';
import { Evento, EventoSchema } from '../database/schemas/evento.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Evento.name, schema: EventoSchema }]),
    AuthModule,
  ],
  controllers: [EventoController],
  providers: [EventoService],
  exports: [EventoService],
})
export class EventoModule {}
