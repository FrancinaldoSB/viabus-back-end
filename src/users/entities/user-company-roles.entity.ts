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
    enum: ['client', 'employee', 'admin', 'owner'],
    default: 'client',
  })
  role: 'client' | 'employee' | 'admin' | 'owner';

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  permissions: RolePermission[];

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive';

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
