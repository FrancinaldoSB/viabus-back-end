import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripBus } from './entities/trip-bus.entity';
import { Trip } from './entities/trip.entity';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, TripBus])],
  controllers: [TripController],
  providers: [TripService],
  exports: [TripService],
})
export class TripsModule {}
