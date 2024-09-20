/*
  Warnings:

  - You are about to drop the column `boarding_time` on the `Stop` table. All the data in the column will be lost.
  - You are about to drop the `StopAddress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `boarding_time` to the `RouteStop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city_name` to the `Stop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Stop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Stop` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StopAddress" DROP CONSTRAINT "StopAddress_stop_id_fkey";

-- AlterTable
ALTER TABLE "RouteStop" ADD COLUMN     "boarding_time" TIME NOT NULL;

-- AlterTable
ALTER TABLE "Stop" DROP COLUMN "boarding_time",
ADD COLUMN     "cep" INTEGER,
ADD COLUMN     "city_name" TEXT NOT NULL,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "number" INTEGER,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Telephone" ALTER COLUMN "phone_number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "cpf" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "photo_url" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "StopAddress";
