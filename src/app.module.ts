import { Module } from '@nestjs/common';
import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/user.module';
import { RoutesModule } from './modules/routes/route.module';
import { StopsModule } from './modules/stops/stop.module';
import { TicketsModule } from './modules/tickets/ticket.module';
import { TripsModule } from './modules/trips/trip.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/companies/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    CompanyModule,
    UsersModule,
    RoutesModule,
    StopsModule,
    TicketsModule,
    TripsModule,
  ],
})
export class AppModule {}
