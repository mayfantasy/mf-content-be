import { CreateAccessKeyDto } from './access-key.dto';

export interface IAccessKey {
  id: string;
  key: string;
  name: string;
  description: string;
}

export interface ICreateDbAccessKeyDto {
  api_key: string;
  account_id: string;
  access_key: CreateAccessKeyDto;
}
