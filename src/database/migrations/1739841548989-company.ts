import { MigrationInterface, QueryRunner } from "typeorm";

export class Company1739841548989 implements MigrationInterface {
    name = 'Company1739841548989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "legal_name" character varying(100) NOT NULL, "trade_name" character varying(100) NOT NULL, "cnpj" character varying(14) NOT NULL, "email" character varying(100) NOT NULL, "phone" character varying(11) NOT NULL, "logo_url" character varying(255) NOT NULL, "website" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "companies"`);
    }

}
