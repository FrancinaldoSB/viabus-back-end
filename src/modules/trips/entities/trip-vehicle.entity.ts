import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Driver } from '../../drivers/entities/driver.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Trip } from './trip.entity';

@Entity('trip_vehicles')
export class TripVehicle {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'trip_id', type: 'uuid' })
  tripId: string;

  @ManyToOne(() => Trip, (trip) => trip.tripVehicles)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column({ name: 'vehicle_id', type: 'uuid' })
  vehicleId: string;

  @ManyToOne(() => Vehicle, { eager: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column({ name: 'primary_driver_id', type: 'uuid' })
  primaryDriverId: string;

  @ManyToOne(() => Driver, { eager: true })
  @JoinColumn({ name: 'primary_driver_id' })
  primaryDriver: Driver;

  @Column({ name: 'secondary_driver_id', type: 'uuid', nullable: true })
  secondaryDriverId?: string;

  @ManyToOne(() => Driver, { eager: true })
  @JoinColumn({ name: 'secondary_driver_id' })
  secondaryDriver?: Driver;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'observations', type: 'text', nullable: true })
  observations?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
