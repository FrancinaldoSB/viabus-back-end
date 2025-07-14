import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

export enum DriverStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  SUSPENDED = 'suspended',
}

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'cpf', type: 'varchar', length: 14, unique: true })
  cpf: string;

  @Column({ name: 'license_number', type: 'varchar', length: 20 })
  licenseNumber: string;

  @Column({ name: 'license_category', type: 'varchar', length: 5 })
  licenseCategory: string;

  @Column({ name: 'license_expiry', type: 'date' })
  licenseExpiry: Date;

  @Column({ name: 'phone', type: 'varchar', length: 15 })
  phone: string;

  @Column({ name: 'email', type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ name: 'hire_date', type: 'date' })
  hireDate: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: DriverStatus,
    default: DriverStatus.ACTIVE,
  })
  status: DriverStatus;

  @Column({
    name: 'emergency_contact_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  emergencyContactName?: string;

  @Column({
    name: 'emergency_contact_phone',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  emergencyContactPhone?: string;

  @Column({ name: 'address', type: 'text', nullable: true })
  address?: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
