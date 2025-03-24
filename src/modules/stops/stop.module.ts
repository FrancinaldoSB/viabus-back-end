import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StopsController } from './stop.controller';
import { StopsService } from './stop.service';
import { Stop } from './entities/stop.entity';
import { Address } from '../addresses/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stop, Address])],
  controllers: [StopsController],
  providers: [StopsService],
  exports: [StopsService],
})
export class StopsModule {}
