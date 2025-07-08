import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { RouteSchedule } from './route-schedule.entity';
import { RouteStop } from './route-stop.entity';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 200 })
  description: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'estimated_duration', type: 'varchar', length: 20 })
  estimatedDuration: string;

  @Column({ name: 'distance', type: 'float' })
  distance: number;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => RouteStop, (routeStop) => routeStop.route)
  routeStops: RouteStop[];

  @OneToMany(() => RouteSchedule, (schedule) => schedule.route)
  schedules: RouteSchedule[];
}
