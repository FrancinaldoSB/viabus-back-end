import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateClientDto{
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}