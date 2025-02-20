import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from './company/company.module';
import { ClientsModule } from './clients/clients.module';
import { UsersModule } from './users/users.module';
import { RoutesModule } from './routes/routes.module';
import { StopsModule } from './stops/stops.module';
import { TicketsModule } from './tickets/tickets.module';
import { TripsModule } from './trips/trips.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    CompanyModule,
    UsersModule,
    ClientsModule,
    RoutesModule,
    StopsModule,
    TicketsModule,
    TripsModule,
  ],
})
export class AppModule {}
