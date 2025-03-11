import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('routes')
export class Route{
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 200 })
  description: string;  

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'stops', type: 'json' })
  stops: string;

  @Column({ name: 'estimated_duration', type: 'interval' })
  estimatedDuration: string;

  @Column({ name: 'distance', type: 'float' })
  distance: number;
  

}