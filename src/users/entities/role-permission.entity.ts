import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserCompanyRole } from './user-company-roles.entity';
import { Permission } from './permission.entity';

@Entity('role_permissions')
export class RolePermission {
  @PrimaryColumn()
  roleId: string;

  @PrimaryColumn()
  permissionId: string;

  @ManyToOne(() => UserCompanyRole, (role) => role.permissions, {
    onDelete: 'CASCADE',
  })
  role: UserCompanyRole;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    onDelete: 'CASCADE',
  })
  permission: Permission;
}
