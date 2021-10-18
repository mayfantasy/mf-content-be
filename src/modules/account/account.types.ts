// ** **
// Res

// ** **
// Model
export interface IAccount {
  id: string;
  tier: number;
  email: string;
  username: string;
  password?: string;
  db_key: string;
  api_key: string;
  access_keys: string[];
}

export interface IBasicAccountInfo {
  email: string;
  username: string;
  tier: number;
}

// ** **
// Utils
