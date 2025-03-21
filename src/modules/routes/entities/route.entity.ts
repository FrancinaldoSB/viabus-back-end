import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
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

  @Column({ name: 'estimated_duration', type: 'interval' })
  estimatedDuration: string;

  @Column({ name: 'distance', type: 'float' })
  distance: number;

  @OneToMany(() => RouteStop, (routeStop) => routeStop.route)
  routeStops: RouteStop[];
}
