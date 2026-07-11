import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventoModule } from './evento/evento.module';
import { CertificadoModule } from './certificado/certificado.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/certievents'),
    AuthModule,
    EventoModule,
    CertificadoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
