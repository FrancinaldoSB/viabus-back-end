import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RolePermission } from './role-permission.entity';

export enum PermissionAction {
  WRITE = 'WRITE',
  READ = 'READ',
}

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'module', type: 'varchar', length: 50 })
  module: string;

  @Column({
    name: 'action',
    type: 'enum',
    enum: PermissionAction,
  })
  action: PermissionAction;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermission[];
}
