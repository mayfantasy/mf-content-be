import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

// Used for db account creation only
export class CreateDbAccountDto {
  tier: number;
  email: string;
  username: string;
  password: string;
  db_key: string;
  api_key: string;
  access_keys: string[];
}
