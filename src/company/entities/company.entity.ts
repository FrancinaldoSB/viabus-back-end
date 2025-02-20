import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'legal_name', type: 'varchar', length: 100 })
  legalName: string;

  @Column({ name: 'trade_name', type: 'varchar', length: 100 })
  tradeName: string;

  @Column({ name: 'cnpj', type: 'varchar', length: 14 })
  cnpj: string;

  @Column({ name: 'email', type: 'varchar', length: 100 })
  email: string;

  @Column({ name: 'phone', type: 'varchar', length: 11 })
  phone: string;

  @Column({ name: 'logo_url', type: 'varchar', length: 255 })
  logo_url: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

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
  })
  updatedAt: Date;
}
