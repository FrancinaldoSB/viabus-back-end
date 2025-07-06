import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UsersModule } from '../users/user.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), UsersModule],
  controllers: [CompanyController],
  providers: [CompanyService, RolesGuard],
  exports: [CompanyService],
})
export class CompanyModule {}
