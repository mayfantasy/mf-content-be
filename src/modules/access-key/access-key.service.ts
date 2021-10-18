import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FaunaClientService } from 'src/fauna-client/fauna-client.service';
import { AuthService } from '../auth/auth.service';
import { CreateAccessKeyDto } from './access-key.dto';
import * as randomstring from 'randomstring';
import { IAccessKey, ICreateDbAccessKeyDto } from './access-key.types';
import { Client, query as q } from 'faunadb';
import { EErrorCodes } from 'src/config/errors';

@Injectable()
export class AccessKeyService {
  client: Client;
  constructor(
    private readonly faunadbClientService: FaunaClientService,
    private readonly authService: AuthService,
  ) {
    this.client = faunadbClientService.getClient();
  }

  /**
   *
   * @param createDbAccessKeyDto
   * @returns
   */
  async createAccessKey(
    createDbAccessKeyDto: ICreateDbAccessKeyDto,
  ): Promise<IAccessKey> {
    try {
      // ** **
      // Connect client DB
      const clientDB = this.faunadbClientService.getSubClient(
        createDbAccessKeyDto.api_key,
      );

      // ** **
      // Generate access key
      const key = randomstring.generate(25);

      // ** **
      // Get current account to retrieve all access keys
      const account: any = await this.client.query(
        q.Get(q.Ref(q.Collection('account'), createDbAccessKeyDto.account_id)),
      );

      // ** **
      // Update access keys from current account
      const newAccessKeys = [...(account.data.access_keys || []), key];

      await this.client.query(
        q.Update(
          q.Ref(q.Collection('account'), createDbAccessKeyDto.account_id),
          {
            data: { access_keys: newAccessKeys },
          },
        ),
      );

      // ** **
      // Update the access key collection
      const accessKey: any = await clientDB.query(
        q.Create(q.Collection('access_key'), {
          data: { key, ...createDbAccessKeyDto.access_key },
        }),
      );

      return {
        id: accessKey.ref.id,
        ...accessKey.data,
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(
        EErrorCodes.ACCESS_KEY_00041,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
