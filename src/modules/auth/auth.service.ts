import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { IJwtClaims } from './auth.types';
import { FaunaClientService } from 'src/fauna-client/fauna-client.service';
import { JwtService } from '@nestjs/jwt';
import { ILoginDto } from './auth.dto';
import { Client, RequestResult, query as q } from 'faunadb';
import { EErrorCodes } from 'src/config/errors';
import { IAccount, IBasicAccountInfo } from '../account/account.types';
import { AccountService } from '../account/account.service';

@Injectable()
export class AuthService {
  client: Client;
  constructor(
    private readonly faunaClientService: FaunaClientService,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {
    this.client = faunaClientService.getClient();
  }

  /**
   *
   * @param extractAuthorizedAccount
   * @returns
   */
  async extractAuthorizedAccount(
    headers: any,
    tier: number,
  ): Promise<IAccount> {
    // ** **
    // Get credentials from header
    const token = headers['authentication'];
    const access_key = headers['x-acc-k'];
    try {
      // ** **
      // If authed with token
      if (token) {
        const user = this.verifyToken(token);
        const email = user.email;

        const account = await this.getAccountByEmail(email);

        // ** **
        // Check if user have access to the route
        if (tier < account.tier) {
          throw new HttpException(EErrorCodes.AUTH_00012, HttpStatus.FORBIDDEN);
        }

        return account;
      } else if (access_key) {
        // ** **
        // If authed with access key

        // ** **
        // Check if user have access to the route
        const accounts = await this.accountService.getAccountList();
        const foundAccount = accounts.find((a: IAccount) =>
          a.access_keys.includes(access_key),
        );

        // ** **
        // Check if the account can be found
        if (!foundAccount) {
          throw new HttpException(
            EErrorCodes.INTERNAL_00021,
            HttpStatus.UNAUTHORIZED,
          );
        }

        // ** **
        // Check if user have access to the route
        if (tier < foundAccount.tier) {
          throw new HttpException(EErrorCodes.AUTH_00012, HttpStatus.FORBIDDEN);
        }

        return foundAccount;
      } else {
        throw new HttpException(
          EErrorCodes.AUTH_00014,
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (e) {
      throw new HttpException(EErrorCodes.AUTH_00014, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   *
   * @param account
   * @returns
   */
  signToken(account: IBasicAccountInfo) {
    try {
      return this.jwtService.sign(
        {
          data: account,
        },
        { secret: process.env.JWT_SECRET, expiresIn: '7d' },
      );
    } catch (e) {
      throw new HttpException(
        EErrorCodes.AUTH_00011,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   *
   * @param token
   * @returns
   */
  verifyToken(token: string): IBasicAccountInfo {
    try {
      const claims = this.jwtService.verify<IJwtClaims<IBasicAccountInfo>>(
        token,
        {
          secret: process.env.JWT_SECRET,
        },
      );
      return claims.data;
    } catch (e) {
      throw new HttpException(EErrorCodes.AUTH_00012, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   *
   * @param email
   * @returns
   */
  async getAccountByEmail(email: string): Promise<IAccount> {
    try {
      // ** **
      // Check if it's an account
      const account = await this.client.query<any>(
        q.Get(q.Match(q.Index('get_account_by_email'), email)),
      );
      const { password, ...accountData } = account.data;
      return { id: account.ref.id, ...accountData };
    } catch (e) {
      // ** **
      // If can not find as an account
      if (
        (e.requestResult as RequestResult).statusCode === HttpStatus.NOT_FOUND
      ) {
        try {
          // ** **
          // Check if it's a member
          const account = await this.client.query<any>(
            q.Get(q.Match(q.Index('get_member_by_email'), email)),
          );

          const { password, ...accountData } = account.data;
          return { id: account.ref.id, ...accountData };
        } catch (e) {
          throw new HttpException(
            EErrorCodes.INTERNAL_00021,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }
  }

  /**
   *
   * @param loginDto
   * @returns
   */
  async getAccountByEmailAndPassword(loginDto: ILoginDto): Promise<IAccount> {
    try {
      // Check if it's an account
      const account = await this.client.query<any>(
        q.Get(
          q.Match(q.Index('get_account_by_email_and_password'), [
            loginDto.email,
            loginDto.password,
          ]),
        ),
      );
      const { password, ...accountData } = account.data;

      return { id: account.ref.id, ...accountData };
    } catch (e) {
      // If can not find as an account
      if (
        (e.requestResult as RequestResult).statusCode === HttpStatus.NOT_FOUND
      ) {
        try {
          // Check if it's a member
          const account = await this.client.query<any>(
            q.Get(
              q.Match(q.Index('get_member_by_email_and_password'), [
                loginDto.email,
                loginDto.password,
              ]),
            ),
          );

          const { password, ...accountData } = account.data;
          return { id: account.ref.id, ...accountData };
        } catch (e) {
          throw new HttpException(
            EErrorCodes.INTERNAL_00021,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }
  }
}
