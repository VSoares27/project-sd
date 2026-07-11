import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GerarCertificadoDto {
  @IsString()
  @IsNotEmpty({ message: 'O userId é obrigatório.' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  nome: string;

  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;
}
