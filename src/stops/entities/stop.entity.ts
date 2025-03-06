import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('stops')
export class Stop{
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'latitude', type: 'varchar', length: 100 })
  latitude: string;

  @Column({ name: 'longitude', type: 'varchar', length: 100 })
  longitude: string;
}