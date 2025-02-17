import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'email', type: 'varchar', length: 100 })
  email: string;
  }

