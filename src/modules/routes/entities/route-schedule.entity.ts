import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Route } from './route.entity';

@Entity('route_schedules')
export class RouteSchedule {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'route_id', type: 'uuid' })
  routeId: string;

  @Column({ name: 'day_of_week', type: 'int', comment: '0-6 (domingo-sábado)' })
  dayOfWeek: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Route, (route) => route.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_id' })
  route: Route;
}
