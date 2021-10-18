import { Module } from '@nestjs/common';
import { FaunaClientService } from 'src/fauna-client/fauna-client.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [AuthModule],
  controllers: [AccountController],
  providers: [FaunaClientService, AccountService],
})
export class AccountModule {}
