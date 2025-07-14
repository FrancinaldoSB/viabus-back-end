import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { DriverStatus } from '../entities/driver.entity';

export class CreateDriverDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato XXX.XXX.XXX-XX',
  })
  cpf: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  licenseNumber: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[ABCDE]$/, {
    message: 'Categoria deve ser A, B, C, D ou E',
  })
  licenseCategory: string;

  @IsDateString()
  @IsNotEmpty()
  licenseExpiry: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: 'Telefone deve estar no formato (XX) XXXXX-XXXX',
  })
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @IsDateString()
  @IsNotEmpty()
  hireDate: string;

  @IsOptional()
  @IsEnum(DriverStatus)
  status?: DriverStatus;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: 'Telefone de emergência deve estar no formato (XX) XXXXX-XXXX',
  })
  emergencyContactPhone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
