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
import { Trip } from '../../trips/entities/trip.entity';

export enum TicketStatus {
  RESERVED = 'reserved',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum BoardingPointType {
  OFFICIAL_STOP = 'official_stop',
  SPECIFIC_LOCATION = 'specific_location',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'trip_id', type: 'uuid' })
  tripId: string;

  @ManyToOne(() => Trip, (trip) => trip.tickets, { eager: true })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column({ name: 'passenger_name', type: 'varchar', length: 100 })
  passengerName: string;

  @Column({
    name: 'passenger_document',
    type: 'varchar',
    length: 14,
    nullable: true,
  })
  passengerDocument?: string;

  @Column({ name: 'passenger_phone', type: 'varchar', length: 15 })
  passengerPhone: string;

  @Column({
    name: 'passenger_email',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  passengerEmail?: string;

  @Column({ name: 'seat_number', type: 'varchar', length: 10, nullable: true })
  seatNumber?: string;

  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.RESERVED,
  })
  status: TicketStatus;

  // Embarque
  @Column({
    name: 'boarding_point_type',
    type: 'enum',
    enum: BoardingPointType,
  })
  boardingPointType: BoardingPointType;

  @Column({ name: 'boarding_stop_id', type: 'uuid', nullable: true })
  boardingStopId?: string;

  @Column({
    name: 'boarding_location_description',
    type: 'text',
    nullable: true,
  })
  boardingLocationDescription?: string;

  @Column({
    name: 'boarding_latitude',
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  boardingLatitude?: number;

  @Column({
    name: 'boarding_longitude',
    type: 'decimal',
    precision: 11,
    scale: 8,
    nullable: true,
  })
  boardingLongitude?: number;

  // Desembarque
  @Column({
    name: 'landing_point_type',
    type: 'enum',
    enum: BoardingPointType,
  })
  landingPointType: BoardingPointType;

  @Column({ name: 'landing_stop_id', type: 'uuid', nullable: true })
  landingStopId?: string;

  @Column({
    name: 'landing_location_description',
    type: 'text',
    nullable: true,
  })
  landingLocationDescription?: string;

  @Column({
    name: 'landing_latitude',
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  landingLatitude?: number;

  @Column({
    name: 'landing_longitude',
    type: 'decimal',
    precision: 11,
    scale: 8,
    nullable: true,
  })
  landingLongitude?: number;

  @Column({ name: 'observations', type: 'text', nullable: true })
  observations?: string;

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
