import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { Repository } from 'typeorm';
import { CreateRouteDto } from './dto/create-route.dto';
import { DataSource } from 'typeorm';
import { RouteStop } from './entities/route-stop.entity';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    private readonly dataSource: DataSource,
  ) {}

  async getRoutes(): Promise<Route[]> {
    return await this.routeRepository.find();
  }

  async getRoute(id: string): Promise<Route> {
    const route = await this.routeRepository.findOneBy({ id });
    if (!route) {
      throw new NotFoundException(`Rota com ID ${id} não encontrada`);
    }
    return route;
  }

  async create(createRouteDto: CreateRouteDto): Promise<Route> {
    // Inicia uma transação para garantir consistência
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const route = this.routeRepository.create(createRouteDto);
      const savedRoute = await queryRunner.manager.save(route);

      // Relacionamento com a parada
      if (createRouteDto.stops) {
        const routeStops = createRouteDto.stops.map((stop) => ({
          routeId: savedRoute.id,
          stopId: stop.stopId,
          order: stop.order,
        }));

        await queryRunner.manager.save(RouteStop, routeStops);
      }

      await queryRunner.commitTransaction();
      return savedRoute;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateRoute(
    id: string,
    updateRouteDto: Partial<CreateRouteDto>,
  ): Promise<Route> {
    const route = await this.getRoute(id);
    Object.assign(route, updateRouteDto);
    return await this.routeRepository.save(route);
  }

  async removeRoute(id: string): Promise<void> {
    // Inicia uma transação para garantir consistência
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const route = await this.getRoute(id);

      await queryRunner.manager.delete(RouteStop, { routeId: route.id });
      await queryRunner.manager.remove(Route, route);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // async removeRoute(id: string): Promise<void> {
  //   const route = await this.getRoute(id);
  //   await this.routeRepository.remove(route)
  // }
}
