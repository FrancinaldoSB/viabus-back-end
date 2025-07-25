import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteSchedule } from '../routes/entities/route-schedule.entity';
import { RouteStop } from '../routes/entities/route-stop.entity';
import { Route } from '../routes/entities/route.entity';
import { RoutesModule } from '../routes/route.module';
import { TripAutomationController } from './controllers/trip-automation.controller';
import { TripVehicle } from './entities/trip-vehicle.entity';
import { Trip } from './entities/trip.entity';
import { TripService } from './services/trip.service';
import { TripController } from './controllers/trip.controller';
import { TripAutomationService } from './services/trip-automation.service';


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
  controllers: [TripController, TripAutomationController],
  providers: [TripService, TripAutomationService],
  exports: [TripService, TripAutomationService],
})
export class TripsModule {}
