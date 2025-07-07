import { User } from 'src/modules/users/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'legal_name', type: 'varchar', length: 100 })
  legalName: string;

  @Column({ name: 'trade_name', type: 'varchar', length: 100 })
  tradeName: string;

  @Column({ name: 'slug', type: 'varchar', length: 50, unique: true })
  slug: string;

  @Column({ name: 'cnpj', type: 'varchar', length: 14, unique: true })
  cnpj: string;

  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ name: 'phone', type: 'varchar', length: 11 })
  phone: string;

  @Column({ name: 'logo_url', type: 'varchar', length: 255, nullable: true })
  logoUrl: string;

  @Column({
    name: 'primary_color',
    type: 'varchar',
    length: 7,
    default: '#3b82f6',
  })
  primaryColor: string;

  @Column({
    name: 'secondary_color',
    type: 'varchar',
    length: 7,
    default: '#64748b',
  })
  secondaryColor: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  validateSlug() {
    if (!this.slug) {
      throw new Error('Slug is required');
    }
    // Remove espaços e substitui por '-'
    this.slug = this.slug.toLowerCase().replace(/\s+/g, '-');

    if (!/^[a-z0-9-]+$/.test(this.slug)) {
      throw new Error(
        'Slug must only contain lowercase letters, numbers, and dashes',
      );
    }
  }
}
