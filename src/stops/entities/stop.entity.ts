import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('stops')
export class Stop{
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @PrimaryColumn({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @PrimaryColumn({ name: 'latitude', type: 'varchar', length: 100 })
  latitude: string;

  @PrimaryColumn({ name: 'longitude', type: 'varchar', length: 100 })
  longitude: string;
}