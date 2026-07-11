import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SesService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;
  private fromName: string;

  constructor(private configService: ConfigService) {
    const sesClient = new SESv2Client({
      region: this.configService.getOrThrow<string>('AWS_DEFAULT_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });

    // Configura o nodemailer com o client do AWS SES v2 (SESv2Client + SendEmailCommand)
    this.transporter = nodemailer.createTransport({
      SES: { sesClient, SendEmailCommand },
    } as any);

    this.fromEmail = this.configService.getOrThrow<string>('SES_FROM_EMAIL');
    this.fromName = this.configService.get<string>('SES_FROM_NAME') || 'CertiEvents';
  }

  async enviarCertificado(emailDestino: string, nomeUsuario: string, pdfBuffer: Buffer, certificadoId: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: emailDestino,
      subject: 'Seu certificado - Demo Week',
      text: `Olá ${nomeUsuario}, segue em anexo seu certificado de participação na Demo Week.`,
      attachments: [
        {
          filename: 'certificado.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });
  }
}
