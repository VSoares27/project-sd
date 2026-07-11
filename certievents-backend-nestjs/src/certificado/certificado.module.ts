import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificadoController } from './certificado.controller';
import { PdfModule } from '../pdf/pdf.module';
import { S3Service } from '../storage/s3.service';
import { SesService } from '../mail/ses.service';
import { AuthModule } from '../auth/auth.module';
import { Certificado, CertificadoSchema } from '../database/schemas/certificado.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Certificado.name, schema: CertificadoSchema }]),
    AuthModule,
    PdfModule,
  ],
  controllers: [CertificadoController],
  providers: [S3Service, SesService],
})
export class CertificadoModule {}
