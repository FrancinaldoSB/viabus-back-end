import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteSchedule } from '../routes/entities/route-schedule.entity';
import { RouteStop } from '../routes/entities/route-stop.entity';
import { Route } from '../routes/entities/route.entity';
import { RoutesModule } from '../routes/route.module';
import { Trip } from '../trips/entities/trip.entity';
import { ScheduleAvailabilityService } from '../trips/services/schedule-availability.service';
import { TripAutomationService } from '../trips/services/trip-automation.service';
import { Ticket } from './entities/ticket.entity';
import { BookingService } from './services/booking.service';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, Trip, Route, RouteSchedule, RouteStop]),
    RoutesModule,
  ],
  controllers: [TicketController],
  providers: [
    TicketService,
    BookingService,
    TripAutomationService,
    ScheduleAvailabilityService,
  ],
  exports: [TicketService, BookingService],
})
export class TicketsModule {}
