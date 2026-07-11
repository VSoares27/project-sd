import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { CognitoService } from './cognito.service';
import { User, UserSchema } from '../database/schemas/user.schema';
import { CognitoAuthGuard } from './guards/cognito-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [CognitoService, CognitoAuthGuard],
  exports: [CognitoService, CognitoAuthGuard],
})
export class AuthModule {}
