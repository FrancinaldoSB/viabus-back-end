import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

import { UsersModule } from '../users/user.module';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CurrentCompanyGuard } from './guards/current-company.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot(),
    UsersModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService, CurrentCompanyGuard],
  exports: [PassportModule, AuthService, CurrentCompanyGuard],
})
export class AuthModule {}
