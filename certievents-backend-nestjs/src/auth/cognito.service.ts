import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class CognitoService {
  private client: CognitoIdentityProviderClient;
  private clientId: string;

  constructor(private configService: ConfigService) {
    this.client = new CognitoIdentityProviderClient({
      region: this.configService.getOrThrow<string>('AWS_DEFAULT_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.clientId = this.configService.getOrThrow<string>('COGNITO_CLIENT_ID');
  }

  async cadastrar(nome: string, email: string, senha: string) {
    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: senha,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: nome },
      ],
    });
    return this.client.send(command);
  }

  async login(email: string, senha: string) {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: senha,
      },
    });
    return this.client.send(command);
  }

  async getUser(accessToken: string) {
    const command = new GetUserCommand({
      AccessToken: accessToken,
    });
    return this.client.send(command);
  }
}
