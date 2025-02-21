import { IsString, IsEmail, Length, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsEmail()
  @Length(1, 100)
  email: string;

  @IsString()
  @Length(11, 11)
  phone: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  photoUrl?: string;
}
