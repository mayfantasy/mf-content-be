import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateAccountDto, CreateDbAccountDto } from './account.dto';
import * as randomstring from 'randomstring';
import { FaunaClientService } from 'src/fauna-client/fauna-client.service';
import { Client, query as q } from 'faunadb';
import { IAccount } from './account.types';
import { EErrorCodes } from 'src/config/errors';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AccountService {
  client: Client;
  constructor(
    private readonly faunaClientService: FaunaClientService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {
    this.client = faunaClientService.getClient();
  }

  /**
   *
   * @returns
   */
  async getAccountList(): Promise<IAccount[]> {
    const accounts: any = await this.client.query(
      q.Map(
        q.Paginate(q.Match(q.Index('all_accounts')), { size: 500 }),
        q.Lambda('X', q.Get(q.Var('X'))),
      ),
    );
    return accounts.data.map((c: any) => ({
      id: c.ref.id,
      ...c.data,
    }));
  }
  /**
   *
   * @param accountDto
   * @returns
   */
  async createAccount(accountDto: CreateAccountDto): Promise<IAccount> {
    // ** **
    // Check if account exists
    const existingAccount = await this.authService.getAccountByEmail(
      accountDto.email,
    );
    if (existingAccount.email) {
      throw new HttpException(
        EErrorCodes.ACCOUNT_00032,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    try {
      // ** **
      // client database params
      const db_id = randomstring.generate(15);
      const db_key = `mf-schema-client-${db_id}`;

      /**
       * Step 1:
       * Create ClientDB and Get Client Database API_KEY
       */
      const api_key: string = await this.client.query(
        q.Do(
          /** Create Client Database */
          q.CreateDatabase({ name: db_key }),
          /** Create ClientDB Role */
          q.Select(
            'secret',
            q.CreateKey({
              database: q.Database(db_key),
              role: 'server',
            }),
          ),
        ),
      );

      /** Connect client DB */
      const clientDB = this.faunaClientService.getSubClient(api_key);

      /**
       * Step 2:
       * Setup Collections and Indexes
       */
      // Create Access Key Collection
      await clientDB.query(q.CreateCollection({ name: 'access_key' }));
      await clientDB.query(
        q.CreateIndex({
          name: 'all_access_keys',
          source: q.Collection('access_key'),
        }),
      );
      await clientDB.query(
        q.CreateIndex({
          name: 'get_access_key_by_key',
          source: q.Collection('access_key'),
          terms: [
            {
              field: ['data', 'key'],
            },
          ],
          unique: true,
        }),
      );

      // ** **
      // Create Collection Collection
      await clientDB.query(q.CreateCollection({ name: 'collection' }));
      await clientDB.query(
        q.CreateIndex({
          name: 'all_collections',
          source: q.Collection('collection'),
        }),
      );
      await clientDB.query(
        q.CreateIndex({
          name: 'get_collection_by_handle',
          source: q.Collection('collection'),
          terms: [
            {
              field: ['data', 'handle'],
            },
          ],
          unique: true,
        }),
      );

      // ** **
      // Create Shortcut Collection
      await clientDB.query(
        q.CreateCollection({
          name: 'shortcut',
        }),
      );
      await clientDB.query(
        q.CreateIndex({
          name: 'all_shortcuts',
          source: q.Collection('shortcut'),
        }),
      );

      // ** **
      // Create Schema Collection
      await clientDB.query(q.CreateCollection({ name: 'schema' }));
      await clientDB.query(
        q.CreateIndex({
          name: 'all_schemas',
          source: q.Collection('schema'),
        }),
      );
      await clientDB.query(
        q.CreateIndex({
          name: 'get_schema_by_handle',
          source: q.Collection('schema'),
          terms: [
            {
              field: ['data', 'handle'],
            },
          ],
          unique: true,
        }),
      );

      // ** **
      // Create User Collection
      await clientDB.query(q.CreateCollection({ name: 'user' }));
      await clientDB.query(
        q.CreateIndex({
          name: 'all_users',
          source: q.Collection('user'),
        }),
      );
      await clientDB.query(
        q.CreateIndex({
          name: 'get_user_by_accountDto.email',
          source: q.Collection('user'),
          terms: [
            {
              field: ['data', 'accountDto.email'],
            },
          ],
          unique: true,
        }),
      );
      await clientDB.query(
        q.CreateIndex({
          name: 'get_user_by_accountDto.email_and_accountDto.password',
          source: q.Collection('user'),
          terms: [
            {
              field: ['data', 'accountDto.email'],
            },
            {
              field: ['data', 'accountDto.password'],
            },
          ],
          unique: true,
        }),
      );

      // ** **
      // Create object collection
      await clientDB.query(q.CreateCollection({ name: 'object' }));
      await clientDB.query(
        q.CreateIndex({
          name: 'all_objects',
          source: q.Collection('object'),
        }),
      );
      await clientDB.query(
        q.CreateIndex({
          name: 'get_object_by_handle',
          source: q.Collection('object'),
          terms: [
            {
              field: ['data', '_handle'],
            },
          ],
          uniqueness: true,
        }),
      );
      await clientDB.query(
        q.CreateIndex({
          name: 'get_objects_by_schema_handle',
          source: q.Collection('object'),
          terms: [
            {
              field: ['data', '_schema_handle'],
            },
          ],
        }),
      );

      /**
       * Step 3:
       * Create account
       */
      const account = await this.client.query<any>(
        q.Create(q.Collection('account'), {
          data: {
            email: accountDto.email,
            username: accountDto.username,
            password: accountDto.password,
            tier: 1,
            db_key,
            api_key,
          } as CreateDbAccountDto,
        }),
      );

      const { password, ...accountData } = account.data;

      return { id: account.ref.id, ...accountData };
    } catch (e) {
      throw new HttpException(
        EErrorCodes.ACCOUNT_00031,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
