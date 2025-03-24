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
    return await this.routeRepository.find({
      where: { companyId },
      relations: ['routeStops', 'routeStops.stop'],
    });
  }

  async getRoute(id: string, companyId: string): Promise<Route> {
    const route = await this.routeRepository.findOne({
      where: { id, companyId },
      relations: ['routeStops', 'routeStops.stop'],
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
          departureTime: stop.departureTime,
        }));

        await queryRunner.manager.save(RouteStop, routeStops);
      }

      await queryRunner.commitTransaction();
      console.log(savedRoute);
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Busca a rota existente
      const route = await this.getRoute(id, companyId);

      // Atualiza as propriedades da rota
      const { stops, ...routeData } = updateRouteDto;
      Object.assign(route, routeData);

      // Salva as alterações na rota
      const updatedRoute = await queryRunner.manager.save(route);

      // Se há atualização nas paradas
      if (stops) {
        // Remove as paradas existentes para essa rota
        await queryRunner.manager.delete(RouteStop, { routeId: id });

        // Cria os novos RouteStops
        const routeStops = stops.map((stop) => ({
          routeId: id,
          stopId: stop.stopId,
          order: stop.order,
          departureTime: stop.departureTime,
        }));

        await queryRunner.manager.save(RouteStop, routeStops);
      }

      await queryRunner.commitTransaction();
      return updatedRoute;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async removeRoute(id: string, companyId: string): Promise<void> {
    const route = await this.getRoute(id, companyId);
    await this.routeRepository.delete(route.id);
  }
}
