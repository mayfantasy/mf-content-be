import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { Delete } from 'faunadb';
import { result } from 'src/helpers/utils';
import { IResult } from 'src/types/utils';
import { AuthService } from '../auth/auth.service';
import { CreateAccessKeyDto } from './access-key.dto';
import { AccessKeyService } from './access-key.service';
import { IAccessKey } from './access-key.types';
import { tierMap } from '../auth/auth.config';

@Controller('access-key')
export class AccessKeyController {
  constructor(
    private readonly accessKeyService: AccessKeyService,
    private readonly authService: AuthService,
  ) {}

  @Post('/create')
  async createAccessKey(
    @Body() createAccessKeyDto: CreateAccessKeyDto,
    @Headers() headers,
  ): Promise<IResult<IAccessKey>> {
    // ** **
    // Get account from header token/access-key --
    const account = await this.authService.extractAuthorizedAccount(
      headers,
      tierMap.LOGIN.tier,
    );

    // ** **
    // Create access key
    const accessKey = await this.accessKeyService.createAccessKey({
      api_key: account.api_key,
      account_id: account.id,
      access_key: createAccessKeyDto,
    });

    // Generate result
    return result(accessKey);
  }

  // @Get('/list')
  // async getAccessKeyList(): Promise<IResult<IAccessKey[]>> {

  // }

  // @Delete('/delete/:id')
  // async deleteAccessKey(): Promise<IResult<IAccessKey>> {

  // }
}
