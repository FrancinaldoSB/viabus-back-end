import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';

@Entity('user_company_roles')
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
