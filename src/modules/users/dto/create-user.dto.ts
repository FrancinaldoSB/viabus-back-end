import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { UserRole } from '../../../core/enums/user-role.enum';
import { UserStatus } from '../../../core/enums/user-status.enum';

export class CreateUserDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsEmail()
  @Length(1, 100)
  email: string;

  @IsString()
  @Length(6, 255)
  password: string;

  @IsOptional()
  @IsString()
  @Length(11, 11)
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  photoUrl?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsUUID()
  companyId?: string;
}
