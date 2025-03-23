import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RouteStop } from '../../routes/entities/route-stop.entity';
import { Company } from '../../companies/entities/company.entity';

@Entity('stops')
export class Stop {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'latitude', type: 'varchar', length: 100 })
  latitude: string;

  @Column({ name: 'longitude', type: 'varchar', length: 100 })
  longitude: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive?: boolean;

  @Column({ name: 'has_accessibility', type: 'boolean', default: false })
  hasAccessibility?: boolean;

  @Column({ name: 'has_shelter', type: 'boolean', default: false })
  hasShelter?: boolean;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => RouteStop, (routeStop) => routeStop.stop)
  routeStops: RouteStop[];
}
