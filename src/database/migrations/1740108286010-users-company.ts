import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersCompany1740108286010 implements MigrationInterface {
    name = 'UsersCompany1740108286010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_company_roles" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_company_roles" DROP COLUMN "updated_at"`);
    }

}
