import { Body, Controller, Post } from '@nestjs/common';
import { result } from 'src/helpers/utils';
import { IResult } from 'src/types/utils';
import { CreateAccountDto } from './account.dto';
import { AccountService } from './account.service';
import { IAccount } from './account.types';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/create')
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<IResult<IAccount>> {
    // ** **
    // Create account
    const account = await this.accountService.createAccount(createAccountDto);

    // ** **
    // Generate result
    return result(account);
  }
}
