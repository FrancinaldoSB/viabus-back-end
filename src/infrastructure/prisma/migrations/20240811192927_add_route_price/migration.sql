/*
  Warnings:

  - You are about to drop the `TripPassenger` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `trip_id` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TripPassenger" DROP CONSTRAINT "TripPassenger_ticket_id_fkey";

-- DropForeignKey
ALTER TABLE "TripPassenger" DROP CONSTRAINT "TripPassenger_trip_id_fkey";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "trip_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "TripPassenger";

-- CreateTable
CREATE TABLE "RoutePrice" (
    "id" SERIAL NOT NULL,
    "route_id" INTEGER NOT NULL,
    "origin_stop_id" INTEGER NOT NULL,
    "destination_stop_id" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RoutePrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoutePrice_route_id_origin_stop_id_destination_stop_id_key" ON "RoutePrice"("route_id", "origin_stop_id", "destination_stop_id");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutePrice" ADD CONSTRAINT "RoutePrice_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutePrice" ADD CONSTRAINT "RoutePrice_origin_stop_id_fkey" FOREIGN KEY ("origin_stop_id") REFERENCES "Stop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutePrice" ADD CONSTRAINT "RoutePrice_destination_stop_id_fkey" FOREIGN KEY ("destination_stop_id") REFERENCES "Stop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
