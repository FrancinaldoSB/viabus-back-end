import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteSchedule } from '../routes/entities/route-schedule.entity';
import { RouteStop } from '../routes/entities/route-stop.entity';
import { Route } from '../routes/entities/route.entity';
import { RoutesModule } from '../routes/route.module';
import { AvailabilityController } from './controllers/availability.controller';
import { TripController } from './controllers/trip.controller';
import { TripVehicle } from './entities/trip-vehicle.entity';
import { Trip } from './entities/trip.entity';
import { AvailabilityService } from './services/availability.service';
import { ScheduleAvailabilityService } from './services/schedule-availability.service';
import { TripAutomationService } from './services/trip-automation.service';
import { TripService } from './services/trip.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Trip,
      TripVehicle,
      RouteSchedule,
      Route,
      RouteStop,
    ]),
    RoutesModule,
  ],
  controllers: [TripController, AvailabilityController],
  providers: [
    TripService,
    TripAutomationService,
    ScheduleAvailabilityService,
    AvailabilityService,
  ],
  exports: [
    TripService,
    TripAutomationService,
    ScheduleAvailabilityService,
    AvailabilityService,
  ],
})
export class TripsModule {}
