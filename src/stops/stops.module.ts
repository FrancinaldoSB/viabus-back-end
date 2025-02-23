import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StopsController } from './stops.controller';
import { StopsService } from './stops.service';
import { Stop } from './entities/stop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stop])], 
  controllers: [StopsController],
  providers: [StopsService], 
  exports: [StopsService],
})
export class StopsModule {}
