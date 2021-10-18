import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FaunaClientService } from './fauna-client/fauna-client.service';
import faunadb, { query as q } from 'faunadb';
import { AccountModule } from './modules/account/account.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessKeyModule } from './modules/access-key/access-key.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    AccountModule,
    AccessKeyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
