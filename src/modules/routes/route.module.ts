import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { RouteStop } from './entities/route-stop.entity';
import { RoutesController } from './route.controller';
import { RouteService } from './route.service';

@Module({
  imports: [TypeOrmModule.forFeature([Route, RouteStop])],
  controllers: [RoutesController],
  providers: [RouteService],
  exports: [RouteService],
})
export class RoutesModule {}
