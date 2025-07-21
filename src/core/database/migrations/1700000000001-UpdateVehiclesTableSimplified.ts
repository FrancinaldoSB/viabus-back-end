import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UpdateVehiclesTableSimplified1700000000001
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remover tabela existente se houver
    await queryRunner.dropTable('vehicles', true);

    // Criar nova tabela simplificada
    await queryRunner.createTable(
      new Table({
        name: 'vehicles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'plate',
            type: 'varchar',
            length: '8',
            isUnique: true,
          },
          {
            name: 'model',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'brand',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'year',
            type: 'int',
          },
          {
            name: 'capacity',
            type: 'int',
          },
          {
            name: 'category',
            type: 'enum',
            enum: ['small', 'medium', 'large'],
            default: "'medium'",
          },
          {
            name: 'comfort_configuration',
            type: 'enum',
            enum: ['conventional', 'executive', 'semi_sleeper', 'sleeper'],
            default: "'conventional'",
          },
          {
            name: 'bus_type',
            type: 'enum',
            enum: ['ld', 'dd'],
            isNullable: true,
          },
          {
            name: 'acquisition_date',
            type: 'date',
          },
          {
            name: 'odometer',
            type: 'int',
            default: 0,
          },
          {
            name: 'last_maintenance',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'next_maintenance',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive', 'maintenance', 'out_of_service'],
            default: "'active'",
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'company_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_vehicles_company',
            columnNames: ['company_id'],
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        indices: [
          {
            name: 'IDX_vehicles_plate',
            columnNames: ['plate'],
          },
          {
            name: 'IDX_vehicles_category',
            columnNames: ['category'],
          },
          {
            name: 'IDX_vehicles_company_id',
            columnNames: ['company_id'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('vehicles');
  }
}
