import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/companies/company.module';
import { RoutesModule } from './modules/routes/route.module';
import { StopsModule } from './modules/stops/stop.module';
import { TicketsModule } from './modules/tickets/ticket.module';
import { TripsModule } from './modules/trips/trip.module';
import { UsersModule } from './modules/users/user.module';

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
    RoutesModule,
    StopsModule,
    TicketsModule,
    TripsModule,
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
