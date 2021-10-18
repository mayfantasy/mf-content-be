import { IsEmail, IsNotEmpty } from 'class-validator';

export class ILoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class ITokenDto {
  @IsNotEmpty()
  token: string;
}
