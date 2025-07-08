import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseCompanyService } from '../../common/base/base-company.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { RouteStop } from './entities/route-stop.entity';
import { Route } from './entities/route.entity';

@Injectable()
export class RouteService extends BaseCompanyService<Route> {
  constructor(
    @InjectRepository(Route)
    protected readonly repository: Repository<Route>,
    @InjectRepository(RouteStop)
    private readonly routeStopRepository: Repository<RouteStop>,
  ) {
    super(repository);
  }

  protected getEntityName(): string {
    return 'Route';
  }

  protected getDefaultFindOptions(): FindManyOptions<Route> {
    return {
      relations: ['routeStops', 'routeStops.stop', 'routeStops.stop.address'],
      order: { name: 'ASC' },
    };
  }

  // Método para paginação
  async findAndCount(
    companyId: string,
    options: {
      page: number;
      limit: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    },
  ): Promise<[Route[], number]> {
    const { page, limit, sortBy = 'name', sortOrder = 'ASC' } = options;
    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions<Route> = {
      ...this.getDefaultFindOptions(),
      where: { companyId } as any,
      skip,
      take: limit,
      order: { [sortBy]: sortOrder } as any,
    };

    return this.repository.findAndCount(findOptions);
  }

  // Sobrescrever o método create para lidar com route_stops
  async create(data: CreateRouteDto, companyId: string): Promise<Route> {
    if (!companyId) {
      throw new Error('Usuário não possui empresa associada');
    }

    this.logger.debug(
      `Criando ${this.getEntityName()} para empresa: ${companyId}`,
    );

    // Extrair stops do data
    const { stops, ...routeData } = data;

    // Criar a route primeiro
    const route = this.repository.create({
      ...routeData,
      companyId,
    } as Route);

    const savedRoute = await this.repository.save(route);

    // Criar route_stops se existirem
    if (stops && stops.length > 0) {
      const routeStops = stops.map((stop) =>
        this.routeStopRepository.create({
          routeId: savedRoute.id,
          stopId: stop.stopId,
          order: stop.order,
          departureTime: stop.departureTime,
        }),
      );

      await this.routeStopRepository.save(routeStops);

      // Recarregar a route com as relações
      return this.findOne(savedRoute.id, companyId);
    }

    return savedRoute;
  }

  // Método específico para buscar rotas ativas
  async findActiveRoutes(companyId: string): Promise<Route[]> {
    const options: FindManyOptions<Route> = {
      ...this.getDefaultFindOptions(),
      where: { companyId, isActive: true } as any,
    };

    return this.repository.find(options);
  }
}
