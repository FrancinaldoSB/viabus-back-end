import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { DatabaseModule } from './core/database/database.module';
import { AddressesModule } from './modules/addresses/address.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/companies/company.module';
import { DriversModule } from './modules/drivers/driver.module';
import { RoutesModule } from './modules/routes/route.module';
import { StopsModule } from './modules/stops/stop.module';
import { TicketsModule } from './modules/tickets/ticket.module';
import { TripsModule } from './modules/trips/trip.module';
import { UsersModule } from './modules/users/user.module';
import { VehiclesModule } from './modules/vehicles/vehicle.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
    }),
    DatabaseModule,
    AuthModule,
    CompanyModule,
    UsersModule,
    AddressesModule,
    StopsModule,
    RoutesModule,
    TripsModule,
    TicketsModule,
    DriversModule,
    VehiclesModule,
  ],
  providers: [
    // Global Exception Filters (ordem importa - específico primeiro)
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // Global Guards
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
