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

export enum VehicleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service',
}

export enum VehicleCategory {
  SMALL = 'small', // Van
  MEDIUM = 'medium', // Micro-ônibus
  LARGE = 'large', // Ônibus
}

export enum ComfortConfiguration {
  CONVENTIONAL = 'conventional',
  EXECUTIVE = 'executive',
  SEMI_SLEEPER = 'semi_sleeper',
  SLEEPER = 'sleeper',
}

export enum BusType {
  LD = 'ld', // Low Driver
  DD = 'dd', // Double Decker
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'plate', type: 'varchar', length: 8, unique: true })
  plate: string;

  @Column({ name: 'model', type: 'varchar', length: 100 })
  model: string;

  @Column({ name: 'brand', type: 'varchar', length: 50 })
  brand: string;

  @Column({ name: 'year', type: 'int' })
  year: number;

  @Column({ name: 'capacity', type: 'int' })
  capacity: number;

  @Column({
    name: 'category',
    type: 'enum',
    enum: VehicleCategory,
    default: VehicleCategory.MEDIUM,
  })
  category: VehicleCategory;

  @Column({
    name: 'comfort_configuration',
    type: 'enum',
    enum: ComfortConfiguration,
    default: ComfortConfiguration.CONVENTIONAL,
  })
  comfortConfiguration: ComfortConfiguration;

  @Column({
    name: 'bus_type',
    type: 'enum',
    enum: BusType,
    nullable: true,
  })
  busType?: BusType;

  @Column({ name: 'acquisition_date', type: 'date' })
  acquisitionDate: Date;

  @Column({ name: 'odometer', type: 'int', default: 0 })
  odometer: number;

  @Column({ name: 'last_maintenance', type: 'date', nullable: true })
  lastMaintenance?: Date;

  @Column({ name: 'next_maintenance', type: 'date', nullable: true })
  nextMaintenance?: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.ACTIVE,
  })
  status: VehicleStatus;

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
