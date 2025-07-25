import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseCompanyService } from '../../common/base/base-company.service';
import { CreateRouteScheduleDto } from './dto/create-route-schedule.dto';
import { CreateRouteDto, UpdateRouteDto } from './dto/create-route.dto';
import { RouteSchedule } from './entities/route-schedule.entity';
import { RouteStop } from './entities/route-stop.entity';
import { Route } from './entities/route.entity';

@Injectable()
export class RouteService extends BaseCompanyService<Route> {
  constructor(
    @InjectRepository(Route)
    protected readonly repository: Repository<Route>,
    @InjectRepository(RouteStop)
    private readonly routeStopRepository: Repository<RouteStop>,
    @InjectRepository(RouteSchedule)
    private readonly routeScheduleRepository: Repository<RouteSchedule>,
  ) {
    super(repository);
  }

  protected getEntityName(): string {
    return 'Route';
  }

  protected getDefaultFindOptions(): FindManyOptions<Route> {
    return {
      relations: [
        'routeStops',
        'routeStops.stop',
        'routeStops.stop.address',
        'schedules',
      ],
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

  // Método de criação específico que lida com as paradas
  async create(data: CreateRouteDto, companyId: string): Promise<Route> {
    const { stops, ...routeData } = data;

    // Criar a rota
    const route = this.repository.create({
      ...routeData,
      companyId,
    });

    const savedRoute = await this.repository.save(route);

    // Criar as paradas se existirem
    if (stops && stops.length > 0) {
      const routeStops = stops.map((stop) =>
        this.routeStopRepository.create({
          ...stop,
          routeId: savedRoute.id,
        }),
      );

      await this.routeStopRepository.save(routeStops);
    }

    return this.findOne(savedRoute.id, companyId);
  }

  // Método de atualização específico que lida com as paradas
  async update(
    id: string,
    data: UpdateRouteDto,
    companyId: string,
  ): Promise<Route> {
    // Verificar se a rota existe e pertence à empresa
    const existingRoute = await this.findOne(id, companyId);

    const { stops, ...routeData } = data;

    // Atualizar dados básicos da rota
    Object.assign(existingRoute, routeData);
    await this.repository.save(existingRoute);

    // Se stops foi fornecido, atualizar as paradas
    if (stops) {
      // Remover paradas existentes
      await this.routeStopRepository.delete({ routeId: id });

      // Criar novas paradas
      if (stops.length > 0) {
        const newRouteStops = stops.map((stop) =>
          this.routeStopRepository.create({
            ...stop,
            routeId: id,
          }),
        );

        await this.routeStopRepository.save(newRouteStops);
      }
    }

    // Retornar rota atualizada com todas as relações
    return this.findOne(id, companyId);
  }

  // Método específico para buscar rotas ativas
  async findActiveRoutes(companyId: string): Promise<Route[]> {
    const options: FindManyOptions<Route> = {
      ...this.getDefaultFindOptions(),
      where: { companyId, isActive: true } as any,
    };

    return this.repository.find(options);
  }

  // Métodos para gerenciar schedules
  async createSchedule(
    routeId: string,
    data: CreateRouteScheduleDto,
    companyId: string,
  ): Promise<RouteSchedule> {
    // Verificar se a rota pertence à empresa
    const route = await this.findOne(routeId, companyId);
    if (!route) {
      throw new Error('Rota não encontrada ou não pertence à empresa');
    }

    const schedule = this.routeScheduleRepository.create({
      ...data,
      routeId,
    });

    return this.routeScheduleRepository.save(schedule);
  }

  async updateSchedule(
    scheduleId: string,
    data: Partial<CreateRouteScheduleDto>,
    companyId: string,
  ): Promise<RouteSchedule> {
    const schedule = await this.routeScheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['route'],
    });

    if (!schedule || schedule.route.companyId !== companyId) {
      throw new Error('Schedule não encontrado ou não pertence à empresa');
    }

    Object.assign(schedule, data);
    return this.routeScheduleRepository.save(schedule);
  }

  async deleteSchedule(scheduleId: string, companyId: string): Promise<void> {
    const schedule = await this.routeScheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['route'],
    });

    if (!schedule || schedule.route.companyId !== companyId) {
      throw new Error('Schedule não encontrado ou não pertence à empresa');
    }

    await this.routeScheduleRepository.remove(schedule);
  }

  async updateRouteSchedules(
    routeId: string,
    schedules: CreateRouteScheduleDto[],
    companyId: string,
  ): Promise<Route> {
    // Verificar se a rota pertence à empresa
    const route = await this.findOne(routeId, companyId);
    if (!route) {
      throw new Error('Rota não encontrada ou não pertence à empresa');
    }

    // Remover schedules existentes
    await this.routeScheduleRepository.delete({ routeId });

    // Criar novos schedules
    if (schedules.length > 0) {
      const newSchedules = schedules.map((schedule) =>
        this.routeScheduleRepository.create({
          ...schedule,
          routeId,
        }),
      );
      await this.routeScheduleRepository.save(newSchedules);
    }

    // Retornar rota atualizada
    return this.findOne(routeId, companyId);
  }
}
