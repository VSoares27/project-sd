import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Define o prefixo global 'api' para todas as rotas (ex: /api/login)
  app.setGlobalPrefix('api');

  // Habilita o CORS para permitir requisições do frontend
  app.enableCors();

  // Configura a validação global de payloads utilizando os DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 8000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
