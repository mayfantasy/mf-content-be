import { Module } from '@nestjs/common';
import { AccessKeyService } from './access-key.service';
import { AccessKeyController } from './access-key.controller';
import { FaunaClientService } from 'src/fauna-client/fauna-client.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [AccessKeyService, FaunaClientService],
  controllers: [AccessKeyController],
})
export class AccessKeyModule {}
