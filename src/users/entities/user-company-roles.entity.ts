import {
  Entity,
  ManyToOne,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { RolePermission } from './role-permission.entity';
import { Company } from 'src/company/entities/company.entity';
import { UserRole } from '../enum/user-role.enum';
import { UserStatus } from '../enum/user-status.enum';

@Entity('user_company_roles')
@Unique(['user', 'company']) // Evita duplicação de usuário na mesma empresa
export class UserCompanyRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.companyRoles, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Company, (company) => company.userRoles, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  permissions: RolePermission[];

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
