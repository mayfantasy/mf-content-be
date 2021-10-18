import { Body, Controller, Post } from '@nestjs/common';
import { result } from 'src/helpers/utils';
import { IResult } from 'src/types/utils';
import { ILoginDto, ITokenDto } from './auth.dto';
import { AuthService } from './auth.service';
import { ICredentialLoginRes, ITokenLoginRes } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() loginDto: ILoginDto,
  ): Promise<IResult<ICredentialLoginRes>> {
    // ** **
    // Validate account
    const account = await this.authService.getAccountByEmailAndPassword(
      loginDto,
    );

    // ** **
    // Sign token
    const token = this.authService.signToken({
      email: account.email,
      username: account.username,
      tier: account.tier,
    });

    // ** **
    // Generate result
    return result({
      token,
      account,
    });
  }

  @Post('/token')
  async loginWithToken(
    @Body() tokenDto: ITokenDto,
  ): Promise<IResult<ITokenLoginRes>> {
    // ** **
    // Verify token and decode
    const email = this.authService.verifyToken(tokenDto.token).email;

    // ** **
    // Get account by email
    const account = await this.authService.getAccountByEmail(email);

    // ** **
    // Generate result
    return result({
      account,
    });
  }
}
