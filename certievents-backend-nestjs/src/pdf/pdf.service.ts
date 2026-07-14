import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  async gerarCertificado(
    nome: string,
    evento: string,
    data: string,
    certificadoId: string,
  ): Promise<Buffer> {
    const templatePath = path.join(__dirname, 'templates', 'certificado.hbs');
    const templateStr = fs.readFileSync(templatePath, 'utf8');

    const template = handlebars.compile(templateStr);
    const html = template({
      nome,
      evento,
      data,
      certificadoId,
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'domcontentloaded' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: {
          top: '20px',
          bottom: '20px',
          left: '20px',
          right: '20px',
        },
      });

      return pdfBuffer as Buffer;
    } finally {
      await browser.close();
    }
  }
}