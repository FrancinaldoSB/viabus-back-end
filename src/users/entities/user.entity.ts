import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Company } from '../../company/entities/company.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'email', type: 'varchar', length: 100 })
  email: string;

  @Column({ name: 'phone', type: 'varchar', length: 11 })
  phone: string;

  @Column({ name: 'gender', type: 'varchar', length: 1 })
  gender: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ name: 'photo_url', type: 'varchar', length: 255 })
  photoUrl: string;

  @Column({ name: 'role', type: 'enum', enum: ['admin', 'employee'] })
  role: string;

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;

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
