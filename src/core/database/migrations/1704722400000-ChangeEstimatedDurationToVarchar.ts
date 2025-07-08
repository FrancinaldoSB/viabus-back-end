import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeEstimatedDurationToVarchar1704722400000
  implements MigrationInterface
{
  name = 'ChangeEstimatedDurationToVarchar1704722400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primeiro, converter dados existentes interval para string
    await queryRunner.query(`
      UPDATE routes 
      SET estimated_duration = 
        CASE 
          WHEN estimated_duration IS NOT NULL 
          THEN EXTRACT(EPOCH FROM estimated_duration)::text || 'min'
          ELSE '30min'
        END
    `);

    // Alterar o tipo da coluna
    await queryRunner.query(
      `ALTER TABLE "routes" ALTER COLUMN "estimated_duration" TYPE VARCHAR(20)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "routes" ALTER COLUMN "estimated_duration" TYPE INTERVAL`,
    );
  }
}
