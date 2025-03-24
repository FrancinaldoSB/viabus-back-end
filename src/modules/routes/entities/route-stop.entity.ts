import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Route } from './route.entity';
import { Stop } from '../../stops/entities/stop.entity';

@Entity('route_stops')
export class RouteStop {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'route_id', type: 'uuid' })
  routeId: string;

  @Column({ name: 'stop_id', type: 'uuid' })
  stopId: string;

  @Column({ name: 'order', type: 'int' })
  order: number;

  @Column({ name: 'departure_time', type: 'time', nullable: true })
  departureTime: string;

  @ManyToOne(() => Route, (route) => route.routeStops)
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @ManyToOne(() => Stop, (stop) => stop.routeStops)
  @JoinColumn({ name: 'stop_id' })
  stop: Stop;
}
