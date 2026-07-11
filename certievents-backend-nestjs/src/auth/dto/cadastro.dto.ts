import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CadastroDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  nome: string;

  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve conter no mínimo 8 caracteres.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  senha: string;
}
