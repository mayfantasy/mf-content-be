import { IBasicAccountInfo } from '../account/account.types';
// ** **
// DTO

// ** **
// Res
export interface ICredentialLoginRes {
  token: string;
  account: IBasicAccountInfo;
}

export interface ITokenLoginRes {
  account: IBasicAccountInfo;
}

// ** **
// Model

// ** **
// Utils
export interface IJwtClaims<T> {
  data: T;
  iat: number;
  exp: number;
}

export interface ITier {
  name: string;
  tier: number;
  key: string;
}
