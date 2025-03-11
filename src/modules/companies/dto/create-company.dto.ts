import { IsString, IsEmail, Length, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @Length(1, 100)
  legalName: string;

  @IsString()
  @Length(1, 100)
  tradeName: string;

  @IsString()
  @Length(1, 50)
  slug: string;

  @IsString()
  @Length(14, 14)
  cnpj: string;

  @IsEmail()
  @Length(1, 100)
  email: string;

  @IsString()
  @Length(11, 11)
  phone: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  logoUrl?: string;
}
