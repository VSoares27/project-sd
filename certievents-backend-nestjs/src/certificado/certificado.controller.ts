import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CognitoAuthGuard } from '../auth/guards/cognito-auth.guard';
import { PdfService } from '../pdf/pdf.service';
import { S3Service } from '../storage/s3.service';
import { SesService } from '../mail/ses.service';
import { Certificado, CertificadoDocument } from '../database/schemas/certificado.schema';
import { GerarCertificadoDto } from './dto/gerar-certificado.dto';

@Controller('gerar-certificado')
@UseGuards(CognitoAuthGuard)
export class CertificadoController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly s3Service: S3Service,
    private readonly sesService: SesService,
    @InjectModel(Certificado.name) private readonly certificadoModel: Model<CertificadoDocument>,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async gerar(@Body() dto: GerarCertificadoDto) {
    const certificadoId = uuidv4();
    const nomeEvento = 'Demo Week';

    // Formata a data de emissão: DD/MM/AAAA
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataEvento = `${dia}/${mes}/${ano}`;

    try {
      // 1. Gera o PDF como Buffer em memória (evitando gravação em disco)
      const pdfBuffer = await this.pdfService.gerarCertificado(
        dto.nome,
        nomeEvento,
        dataEvento,
        certificadoId,
      );

      // 2. Faz o upload para o AWS S3
      const urlS3 = await this.s3Service.upload(pdfBuffer, dto.userId, certificadoId);

      // 3. Salva o registro no MongoDB (substituindo o DynamoDB)
      await this.certificadoModel.create({
        certificadoId,
        userId: dto.userId,
        nomeEvento,
        urlS3,
        status: 'emitido',
      });

      // 4. Envia o PDF em anexo por e-mail via AWS SES
      await this.sesService.enviarCertificado(dto.email, dto.nome, pdfBuffer, certificadoId);

      return {
        message: 'Certificado gerado e enviado por e-mail com sucesso.',
        certificadoId,
        urlS3,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Erro durante a geração ou envio do certificado.',
        error: error.message || error,
      });
    }
  }
}
