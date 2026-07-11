import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  private templateStr: string;

  constructor() {
    const templatePath = path.join(__dirname, 'templates', 'certificado.hbs');
    this.templateStr = fs.readFileSync(templatePath, 'utf8');
  }

  async gerarCertificado(nome: string, evento: string, data: string, certificadoId: string): Promise<Buffer> {
    const bgPath = path.join(__dirname, 'templates', 'template-demo-week.jpg');
    let bgImageBase64 = '';
    if (fs.existsSync(bgPath)) {
      bgImageBase64 = fs.readFileSync(bgPath).toString('base64');
    }

    const template = handlebars.compile(this.templateStr);
    const html = template({ nome, evento, data, certificadoId, bgImageBase64 });

    // Inicia o Puppeteer no modo headless
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'domcontentloaded' });

      // Gera o PDF no formato A4 horizontal (landscape)
      const pdfBuffer = await page.pdf({
        format: 'A4',
        landscape: true,
        printBackground: true,
      });

      return pdfBuffer as Buffer;
    } finally {
      await browser.close();
    }
  }
}
