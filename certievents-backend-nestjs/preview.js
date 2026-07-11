const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer');

async function generatePreview() {
  console.log('Iniciando geração de preview...');
  
  // Caminhos
  const templatePath = path.join(__dirname, 'src', 'pdf', 'templates', 'certificado.hbs');
  const imagePath = path.join(__dirname, 'src', 'pdf', 'templates', 'template-demo-week.png');
  const outHtmlPath = path.join(__dirname, 'preview-certificado.html');
  const outPdfPath = path.join(__dirname, 'preview-certificado.pdf');
  
  if (!fs.existsSync(templatePath)) {
    console.error(`Erro: Arquivo de template não encontrado em ${templatePath}`);
    return;
  }
  
  if (!fs.existsSync(imagePath)) {
    console.error(`Erro: Imagem de fundo não encontrada em ${imagePath}`);
    return;
  }

  // 1. Carrega o template e converte imagem para Base64
  const templateStr = fs.readFileSync(templatePath, 'utf8');
  const bgImageBase64 = fs.readFileSync(imagePath).toString('base64');
  
  // 2. Compila com dados fictícios de teste
  const template = handlebars.compile(templateStr);
  const html = template({
    nome: 'Victor Gustavo (Preview)',
    evento: 'Demo Week 2026',
    data: '15 e 16 de Julho',
    certificadoId: 'PREVIEW-VALID-89012'
  });
  
  // 3. Salva a versão HTML temporária
  fs.writeFileSync(outHtmlPath, html, 'utf8');
  console.log(`[HTML] Arquivo HTML de teste gerado: ${outHtmlPath}`);
  
  // 4. Inicia o Puppeteer para gerar o PDF
  console.log('Iniciando Puppeteer para gerar PDF...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    
    // Gera o PDF no mesmo formato usado pelo backend
    await page.pdf({
      path: outPdfPath,
      format: 'A4',
      landscape: true,
      printBackground: true,
    });
    
    console.log(`[PDF] Arquivo PDF de teste gerado com sucesso: ${outPdfPath}`);
    console.log('\nVocê já pode abrir o arquivo "preview-certificado.pdf" para visualizar o certificado final!');
  } catch (error) {
    console.error('Erro ao gerar PDF com Puppeteer:', error);
  } finally {
    await browser.close();
  }
}

generatePreview();
