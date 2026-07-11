import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.client = new S3Client({
      region: this.configService.getOrThrow<string>('AWS_DEFAULT_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucket = this.configService.getOrThrow<string>('S3_BUCKET');
  }

  async upload(pdfBuffer: Buffer, userId: string, certificadoId: string): Promise<string> {
    const key = `certificados/${userId}/${certificadoId}.pdf`;

    // Realiza o upload do buffer diretamente para o S3
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
      }),
    );

    // Cria o comando GetObject para gerar a URL pré-assinada
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    // Gera uma URL pré-assinada válida por 60 minutos (3600 segundos)
    return getSignedUrl(this.client, command, { expiresIn: 3600 });
  }
}
