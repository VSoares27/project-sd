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

    this.transporter = nodemailer.createTransport({
      SES: { sesClient, SendEmailCommand },
    } as any);

    this.fromEmail = this.configService.getOrThrow<string>('SES_FROM_EMAIL');
    this.fromName = this.configService.get<string>('SES_FROM_NAME') || 'CertiEvents';
  }

  async enviarCertificado(
    emailDestino: string,
    nomeUsuario: string,
    pdfBuffer: Buffer,
    certificadoId: string,
    dataEvento?: string,
  ): Promise<void> {
    const htmlContent = this.buildEmailHtml(nomeUsuario, dataEvento);

    const attachments: any[] = [
      {
        filename: 'certificado-demo-week.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ];

    await this.transporter.sendMail({
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: emailDestino,
      subject: '🎓 Seu certificado da Demo Week - Parabéns!',
      html: htmlContent,
      text: `Olá ${nomeUsuario}, segue em anexo seu certificado de participação na Demo Week.\n\nAcesse: https://www.instagram.com/demoweek.igarassu\n\nAcesse também: https://www.instagram.com/ifpecampusigarassu`,
      attachments,
    });
  }

  private buildEmailHtml(nomeUsuario: string, dataEvento?: string): string {
    const instagramEventoUrl =
      'https://www.instagram.com/demoweek.igarassu?igsh=MW1qOTB3ZGk0YWdyYw==';
    const instagramCampusUrl =
      'https://www.instagram.com/ifpecampusigarassu?igsh=a2VvcHF5M3BhdmE2';
    const mapsUrl =
      'https://www.google.com/maps/place/IFPE+-+Campus+Igarassu/@-7.7323866,-34.9420921,17z/data=!3m1!4b1!4m6!3m5!1s0x7ab69471b95da5f:0x57b430b32c9fcb0e!8m2!3d-7.7323866!4d-34.9420921!16s%2Fg%2F11k9jgfzdg?entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D';

    const dataTexto = dataEvento || '15 e 16 de Julho de 2025';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificado Demo Week</title>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #0F0B18;
  font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  width: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
">
  <!-- WRAPPER -->
  <table width="100%" cellpadding="0" cellspacing="0" style="
    background-color: #0F0B18;
    padding: 32px 16px;
  ">
    <tr>
      <td align="center">
        <!-- CARD PRINCIPAL - largura 880px -->
        <table width="100%" cellpadding="0" cellspacing="0" style="
          max-width: 880px;
          background-color: #171126;
          border-radius: 24px;
          border: 1px solid rgba(177, 92, 255, 0.10);
          box-shadow: 0 16px 64px rgba(0, 0, 0, 0.40), 0 2px 8px rgba(177, 92, 255, 0.04);
          margin: 0 auto;
        ">
          <!-- ============================================================ -->
          <!-- HEADER -->
          <!-- ============================================================ -->
          <tr>
            <td style="padding: 0 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 24px 0 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.04);">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="left" style="width: 50%;">
                          <span style="
                            font-family: 'Sora', sans-serif;
                            font-size: 18px;
                            font-weight: 700;
                            color: #B15CFF;
                            letter-spacing: 0.15em;
                          ">
                            DEMO WEEK
                          </span>
                        </td>
                        <td align="right" style="width: 50%;">
                          <span style="
                            font-family: 'Sora', sans-serif;
                            font-size: 18px;
                            font-weight: 700;
                            color: #B15CFF;
                            letter-spacing: 0.15em;
                          ">
                            CAMPUS IGARASSU
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================================ -->
          <!-- HERO - CERTIFICADO -->
          <!-- ============================================================ -->
          <tr>
            <td style="padding: 0 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 40px 0 8px; text-align: center;">
                    <div style="
                      display: inline-block;
                      background: linear-gradient(90deg, transparent, rgba(177, 92, 255, 0.12), transparent);
                      padding: 0 16px;
                    ">
                      <span style="
                        font-family: 'Sora', sans-serif;
                        font-size: 13px;
                        font-weight: 600;
                        color: #6A5A7A;
                        letter-spacing: 0.25em;
                        text-transform: uppercase;
                      ">
                        — Certificado —
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0 0; text-align: center;">
                    <h1 style="
                      font-family: 'Sora', sans-serif;
                      font-size: 40px;
                      font-weight: 800;
                      color: #F5C451;
                      letter-spacing: 0.08em;
                      margin: 0;
                      text-shadow: 0 0 60px rgba(245, 196, 81, 0.06);
                    ">
                      CERTIFICADO
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 2px 0 24px; text-align: center;">
                    <span style="
                      font-family: 'Geist', sans-serif;
                      font-size: 15px;
                      font-weight: 400;
                      color: #6A5A7A;
                      letter-spacing: 0.35em;
                      text-transform: uppercase;
                    ">
                      de participação
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================================ -->
          <!-- DIVISOR -->
          <!-- ============================================================ -->
          <tr>
            <td style="padding: 0 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 0;">
                    <div style="
                      width: 100%;
                      height: 1px;
                      background: linear-gradient(90deg, transparent, rgba(177, 92, 255, 0.12), transparent);
                    "></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================================ -->
          <!-- PARTICIPANTE -->
          <!-- ============================================================ -->
          <tr>
            <td style="padding: 0 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 32px 0 12px; text-align: center;">
                    <span style="
                      font-family: 'Geist', sans-serif;
                      font-size: 14px;
                      font-weight: 400;
                      color: #B8B0C9;
                      letter-spacing: 0.05em;
                    ">
                      Certificamos que
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 0 24px; text-align: center;">
                    <span style="
                      font-family: 'Sora', sans-serif;
                      font-size: 42px;
                      font-weight: 700;
                      color: #FFFFFF;
                      letter-spacing: 0.02em;
                      display: inline-block;
                      border-bottom: 3px solid #B15CFF;
                      padding-bottom: 8px;
                      line-height: 1.15;
                    ">
                      ${nomeUsuario}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================================ -->
          <!-- EVENTO - DESCRIÇÃO -->
          <!-- ============================================================ -->
          <tr>
            <td style="padding: 0 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 0 0 20px; text-align: center;">
                    <p style="
                      font-family: 'Geist', sans-serif;
                      font-size: 16px;
                      font-weight: 400;
                      color: #B8B0C9;
                      line-height: 1.65;
                      margin: 0;
                      letter-spacing: 0.01em;
                    ">
                      participou do
                      <strong style="color: #F5C451; font-weight: 600;">DEMO WEEK</strong>
                      – Evento de Tecnologia e Inovação,
                      <br>
                      realizado no dia
                      <strong style="color: #6EE7FF; font-weight: 600;">${dataTexto}</strong>,
                      <br>
                      no
                      <strong style="color: #B15CFF; font-weight: 600;">IFPE Campus Igarassu</strong>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================================ -->
          <!-- AVISO - CERTIFICADO EM ANEXO -->
          <!-- ============================================================ -->
          <tr>
            <td style="padding: 0 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 0 0 32px;">
                    <div style="
                      background: rgba(177, 92, 255, 0.04);
                      border: 1px solid rgba(177, 92, 255, 0.06);
                      border-radius: 12px;
                      padding: 16px 24px;
                      text-align: center;
                    ">
                      <span style="
                        font-family: 'Geist', sans-serif;
                        font-size: 14px;
                        font-weight: 500;
                        color: #F5C451;
                        letter-spacing: 0.06em;
                      ">
                        📎 Seu certificado está em anexo neste e-mail
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================================ -->
          <!-- CARDS - INFORMAÇÕES -->
          <!-- ============================================================ -->
          <tr>
            <td style="padding: 0 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 0 0 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <!-- CARD 1 - DATAS -->
                        <td align="center" style="width: 33.33%; padding: 0 6px;">
                          <div style="
                            background: rgba(255, 255, 255, 0.02);
                            border: 1px solid rgba(255, 255, 255, 0.04);
                            border-radius: 12px;
                            padding: 16px 12px;
                            text-align: center;
                          ">
                            <span style="
                              font-family: 'JetBrains Mono', monospace;
                              font-size: 22px;
                              display: block;
                              margin-bottom: 4px;
                            ">
                              📅
                            </span>
                            <p style="
                              font-family: 'JetBrains Mono', monospace;
                              font-size: 9px;
                              font-weight: 500;
                              color: #6A5A7A;
                              letter-spacing: 0.18em;
                              text-transform: uppercase;
                              margin: 0 0 6px;
                            ">
                              Datas
                            </p>
                            <p style="
                              font-family: 'Geist', sans-serif;
                              font-size: 14px;
                              font-weight: 500;
                              color: #6EE7FF;
                              margin: 0;
                            ">
                              ${dataTexto}
                            </p>
                          </div>
                        </td>

                        <!-- CARD 2 - LOCAL -->
                        <td align="center" style="width: 33.33%; padding: 0 6px;">
                          <div style="
                            background: rgba(255, 255, 255, 0.02);
                            border: 1px solid rgba(255, 255, 255, 0.04);
                            border-radius: 12px;
                            padding: 16px 12px;
                            text-align: center;
                          ">
                            <span style="
                              font-family: 'JetBrains Mono', monospace;
                              font-size: 22px;
                              display: block;
                              margin-bottom: 4px;
                            ">
                              📍
                            </span>
                            <p style="
                              font-family: 'JetBrains Mono', monospace;
                              font-size: 9px;
                              font-weight: 500;
                              color: #6A5A7A;
                              letter-spacing: 0.18em;
                              text-transform: uppercase;
                              margin: 0 0 6px;
                            ">
                              Local
                            </p>
                            <a href="${mapsUrl}" 
                               target="_blank" 
                               style="
                                font-family: 'Geist', sans-serif;
                                font-size: 14px;
                                font-weight: 500;
                                color: #B15CFF;
                                text-decoration: none;
                                border-bottom: 1px solid rgba(177, 92, 255, 0.15);
                                display: inline-block;
                                padding-bottom: 1px;
                                transition: border-color 0.2s ease;
                              "
                              onmouseover="this.style.borderBottomColor='#B15CFF'"
                              onmouseout="this.style.borderBottomColor='rgba(177, 92, 255, 0.15)'">
                              IFPE Igarassu
                            </a>
                          </div>
                        </td>

                        <!-- CARD 3 - ORGANIZAÇÃO -->
                        <td align="center" style="width: 33.33%; padding: 0 6px;">
                          <div style="
                            background: rgba(255, 255, 255, 0.02);
                            border: 1px solid rgba(255, 255, 255, 0.04);
                            border-radius: 12px;
                            padding: 16px 12px;
                            text-align: center;
                          ">
                            <span style="
                              font-family: 'JetBrains Mono', monospace;
                              font-size: 22px;
                              display: block;
                              margin-bottom: 4px;
                            ">
                              🎓
                            </span>
                            <p style="
                              font-family: 'JetBrains Mono', monospace;
                              font-size: 9px;
                              font-weight: 500;
                              color: #6A5A7A;
                              letter-spacing: 0.18em;
                              text-transform: uppercase;
                              margin: 0 0 6px;
                            ">
                              Organização
                            </p>
                            <p style="
                              font-family: 'Geist', sans-serif;
                              font-size: 14px;
                              font-weight: 500;
                              color: #B8B0C9;
                              margin: 0;
                            ">
                              Equipe Demo Week
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================================ -->
          <!-- REDES SOCIAIS - COM COR PADRÃO DEMO WEEK -->
          <!-- ============================================================ -->
          <tr>
            <td style="padding: 0 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 0 0 32px; text-align: center;">
                    <p style="
                      font-family: 'Geist', sans-serif;
                      font-size: 13px;
                      font-weight: 500;
                      color: #FFFFFF;
                      letter-spacing: 0.15em;
                      margin: 0 0 16px;
                      text-transform: uppercase;
                    ">
                      — Siga-nos nas redes sociais —
                    </p>

                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td align="center" style="padding: 0 30px;">
                          <a href="${instagramEventoUrl}" 
                             target="_blank" 
                             style="
                              font-family: 'Sora', sans-serif;
                              font-size: 18px;
                              font-weight: 700;
                              color: #B15CFF;
                              text-decoration: none;
                              transition: all 0.25s ease;
                              letter-spacing: 0.15em;
                              display: inline-block;
                            "
                            onmouseover="this.style.color='#FFFFFF'; this.style.transform='scale(1.05)'"
                            onmouseout="this.style.color='#B15CFF'; this.style.transform='scale(1)'">
                            @demoweek
                          </a>
                        </td>
                        <td align="center" style="padding: 0 30px;">
                          <a href="${instagramCampusUrl}" 
                             target="_blank" 
                             style="
                              font-family: 'Sora', sans-serif;
                              font-size: 18px;
                              font-weight: 700;
                              color: #B15CFF;
                              text-decoration: none;
                              transition: all 0.25s ease;
                              letter-spacing: 0.15em;
                              display: inline-block;
                            "
                            onmouseover="this.style.color='#FFFFFF'; this.style.transform='scale(1.05)'"
                            onmouseout="this.style.color='#B15CFF'; this.style.transform='scale(1)'">
                            @ifpe_igarassu
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================================ -->
          <!-- DIVISOR -->
          <!-- ============================================================ -->
          <tr>
            <td style="padding: 0 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 0;">
                    <div style="
                      width: 100%;
                      height: 1px;
                      background: linear-gradient(90deg, transparent, rgba(177, 92, 255, 0.08), transparent);
                    "></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================================ -->
          <!-- FOOTER -->
          <!-- ============================================================ -->
          <tr>
            <td style="padding: 0 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 24px 0 20px; text-align: center;">
                    <p style="
                      font-family: 'Geist', sans-serif;
                      font-size: 15px;
                      font-weight: 400;
                      color: #B8B0C9;
                      letter-spacing: 0.04em;
                      margin: 0 0 12px;
                      line-height: 1.6;
                    ">
                      Este e-mail é automático, por favor não responda.
                    </p>

                    <p style="
                      font-family: 'Geist', sans-serif;
                      font-size: 14px;
                      font-weight: 400;
                      color: #6A5A7A;
                      letter-spacing: 0.08em;
                      margin: 0;
                    ">
                      © 2025 Demo Week · IFPE Campus Igarassu
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================================ -->
          <!-- FIM DO CARD -->
          <!-- ============================================================ -->
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }
}