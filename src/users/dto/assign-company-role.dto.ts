import { IsEnum, IsUUID } from 'class-validator';
import { UserStatus } from '../enum/user-status.enum';
import { UserRole } from '../enum/user-role.enum';

export class AssignCompanyRoleDto {
  @IsUUID()
  companyId: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsEnum(UserStatus)
  status: UserStatus;
}
