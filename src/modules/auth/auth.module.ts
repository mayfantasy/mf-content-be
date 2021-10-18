import { Module } from '@nestjs/common';
import { FaunaClientService } from 'src/fauna-client/fauna-client.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import faunadb, { query as q } from 'faunadb';
import { JwtModule } from '@nestjs/jwt';
import { AccountService } from '../account/account.service';

@Module({
  imports: [JwtModule.register({ secret: 'hard!to-guess_secret' })],
  controllers: [AuthController],
  providers: [AuthService, FaunaClientService, AccountService],
  exports: [AuthService],
})
export class AuthModule {}
