import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { CognitoService } from '../cognito.service';

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  constructor(private readonly cognitoService: CognitoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não fornecido.');
    }

    const token = authHeader.split(' ')[1];

    try {
      const userInfo = await this.cognitoService.getUser(token);
      
      // Anexa os dados do usuário extraídos do token do Cognito na request
      request.user = {
        userId: userInfo.Username,
        nome: userInfo.UserAttributes?.find((attr) => attr.Name === 'name')?.Value || '',
        email: userInfo.UserAttributes?.find((attr) => attr.Name === 'email')?.Value || '',
      };
      
      return true;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Token inválido ou expirado.',
        error: error.message || error,
      });
    }
  }
}
