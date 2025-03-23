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

  async getRoutes(companyId: string): Promise<Route[]> {
    return await this.routeRepository.find({ where: { companyId } });
  }

  async getRoute(id: string, companyId: string): Promise<Route> {
    const route = await this.routeRepository.findOne({
      where: { id, companyId },
    });

    if (!route) {
      throw new NotFoundException(`Rota com ID ${id} não encontrada`);
    }

    return route;
  }

  async create(
    createRouteDto: CreateRouteDto,
    companyId: string,
  ): Promise<Route> {
    // Inicia uma transação para garantir consistência
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Cria a rota
      const route = this.routeRepository.create({
        ...createRouteDto,
        companyId,
      });

      const savedRoute = await queryRunner.manager.save(route);

      // Cria os RouteStops para cada parada
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
    companyId: string,
  ): Promise<Route> {
    const route = await this.getRoute(id, companyId);
    Object.assign(route, updateRouteDto);
    return await this.routeRepository.save(route);
  }

  async removeRoute(id: string, companyId: string): Promise<void> {
    const route = await this.getRoute(id, companyId);
    await this.routeRepository.delete(route.id);
  }
}
