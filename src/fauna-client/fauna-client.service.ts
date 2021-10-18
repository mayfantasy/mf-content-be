import { Injectable } from '@nestjs/common';
import * as faunadb from 'faunadb';

@Injectable()
export class FaunaClientService {
  getClient() {
    return new faunadb.Client({
      secret: process.env.MF_SCHEMA_ACCOUNT_DB_KEY || 'ENV NOT FOUND',
    });
  }

  getSubClient(key: string) {
    return new faunadb.Client({
      secret: key || 'KEY NOT FOUND',
    });
  }
}
