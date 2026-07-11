import { Body, Controller, Post, HttpStatus, HttpCode, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CognitoService } from './cognito.service';
import { CadastroDto } from './dto/cadastro.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from '../database/schemas/user.schema';

@Controller()
export class AuthController {
  constructor(
    private readonly cognitoService: CognitoService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @Post('cadastro')
  @HttpCode(HttpStatus.CREATED)
  async cadastro(@Body() cadastroDto: CadastroDto) {
    try {
      const result = await this.cognitoService.cadastrar(
        cadastroDto.nome,
        cadastroDto.email,
        cadastroDto.senha,
      );

      const userId = result.UserSub;
      if (!userId) {
        throw new Error('UserSub não retornado pelo Cognito.');
      }

      // Salva os dados do usuário no MongoDB
      await this.userModel.create({
        userId,
        nome: cadastroDto.nome,
        email: cadastroDto.email,
      });

      return {
        message: 'Cadastro realizado. Verifique seu e-mail para confirmar a conta.',
        userId,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'Erro ao cadastrar usuário.',
        error: error.message || error,
      });
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.cognitoService.login(loginDto.email, loginDto.senha);
      const authResult = result.AuthenticationResult;

      if (!authResult || !authResult.AccessToken) {
        throw new UnauthorizedException('Falha na autenticação do Cognito.');
      }

      const accessToken = authResult.AccessToken;
      const userInfo = await this.cognitoService.getUser(accessToken);

      const nome = userInfo.UserAttributes?.find((attr) => attr.Name === 'name')?.Value || '';

      return {
        accessToken,
        idToken: authResult.IdToken ?? '',
        refreshToken: authResult.RefreshToken ?? '',
        userId: userInfo.Username,
        nome,
      };
    } catch (error) {
      throw new UnauthorizedException({
        message: 'E-mail ou senha inválidos.',
        error: error.message || error,
      });
    }
  }
}
