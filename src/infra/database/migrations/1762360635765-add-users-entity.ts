import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsersEntity1762360635765 implements MigrationInterface {
  name = 'AddUsersEntity1762360635765';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_accounttype_enum" AS ENUM('user', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "profilePictureUrl" character varying(255) DEFAULT 'https://example.com/default-profile.png', "username" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "passwordHash" character varying(255) NOT NULL, "refreshTokenHash" character varying(255), "accountType" "public"."users_accounttype_enum" NOT NULL DEFAULT 'user', "ratingCount" integer NOT NULL DEFAULT '0', "lastLogin" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_accounttype_enum"`);
  }
}
