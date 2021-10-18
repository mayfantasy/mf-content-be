import { IsNotEmpty } from 'class-validator';

export class CreateAccessKeyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;
}
