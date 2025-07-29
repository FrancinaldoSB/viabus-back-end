
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'cep', type: 'varchar', length: 8 })
  cep: string;

  @Column({ name: 'street', type: 'varchar', length: 100 })
  street: string;

  @Column({ name: 'number', type: 'varchar', length: 10 })
  number: string;

  @Column({ name: 'complement', type: 'varchar', length: 100, nullable: true })
  complement?: string;

  @Column({ name: 'neighborhood', type: 'varchar', length: 100 })
  neighborhood: string;

  @Column({ name: 'city', type: 'varchar', length: 100 })
  city: string;

  @Column({ name: 'state', type: 'varchar', length: 2 })
  state: string;

  @Column({ name: 'longitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  longitude?: number;

  @Column({ name: 'latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}