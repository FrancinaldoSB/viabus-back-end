import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseCompanyService } from '../../common/base/base-company.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { Route } from './entities/route.entity';

@Injectable()
export class RouteService extends BaseCompanyService<Route> {
  constructor(
    @InjectRepository(Route)
    protected readonly repository: Repository<Route>,
  ) {
    super(repository);
  }

  protected getEntityName(): string {
    return 'Route';
  }

  protected getDefaultFindOptions(): FindManyOptions<Route> {
    return {
      relations: ['routeStops', 'routeStops.stop'],
    };
  }

  // Método específico para criar rota com validação de negócio
  async createRoute(
    createRouteDto: CreateRouteDto,
    companyId: string,
  ): Promise<Route> {
    // Validação específica de rota
    if (createRouteDto.stops && createRouteDto.stops.length < 2) {
      throw new Error('Rota deve ter pelo menos 2 paradas');
    }

    // Usa o método create herdado do BaseCompanyService
    return this.create(createRouteDto, companyId);
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
