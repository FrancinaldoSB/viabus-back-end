import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteSchedule } from '../../routes/entities/route-schedule.entity';
import { RouteStop } from '../../routes/entities/route-stop.entity';
import { Route } from '../../routes/entities/route.entity';
import { ScheduleAvailabilityService } from './schedule-availability.service';

export interface RouteAvailabilityInfo {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  estimatedDuration: number;
  distance: number;
  availability: {
    hasActiveSchedules: boolean;
    activeSchedulesCount: number;
    activeDaysOfWeek: number[];
    availableDatesCount: number;
    availableDates: any[];
    availableTimes: string[];
    nextAvailableDate: string | null;
    isAvailable: boolean;
    error?: string;
  };
  routeStops: any[];
  schedules: any[];
}

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(RouteSchedule)
    private routeScheduleRepository: Repository<RouteSchedule>,
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
    @InjectRepository(RouteStop)
    private routeStopRepository: Repository<RouteStop>,
    private scheduleAvailabilityService: ScheduleAvailabilityService,
  ) {}

  /**
   * Busca rotas com informações de disponibilidade
   */
  async getRoutesWithAvailability(
    companyId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<RouteAvailabilityInfo[]> {
    try {
      // Buscar rotas da empresa
      const routes = await this.routeRepository.find({
        where: { companyId, isActive: true },
        relations: ['schedules', 'routeStops', 'routeStops.stop'],
      });

      if (routes.length === 0) {
        return [];
      }

      // Define o período de busca
      const start = startDate || new Date();
      const maxEndDate = new Date();
      maxEndDate.setDate(maxEndDate.getDate() + 30);
      const end = endDate && endDate <= maxEndDate ? endDate : maxEndDate;

      // Processar cada rota
      const routesWithAvailability = await Promise.all(
        routes.map(async (route) => {
          try {
            const activeSchedules =
              route.schedules?.filter((s) => s.isActive) || [];

            // Buscar datas disponíveis
            const availableDates =
              this.scheduleAvailabilityService.calculateAvailableDates(
                activeSchedules,
                await this.getRouteAvailableTimes(route.id),
                start,
                end,
              );

            // Buscar horários disponíveis
            const availableTimes = await this.getRouteAvailableTimes(route.id);

            // Calcular próxima data disponível
            const nextAvailableDate =
              this.scheduleAvailabilityService.getNextAvailableDate(
                activeSchedules,
              );

            return {
              id: route.id,
              name: route.name,
              description: route.description,
              isActive: route.isActive,
              estimatedDuration: Number(route.estimatedDuration),
              distance: route.distance,
              availability: {
                hasActiveSchedules: activeSchedules.length > 0,
                activeSchedulesCount: activeSchedules.length,
                activeDaysOfWeek: activeSchedules.map((s) => s.dayOfWeek),
                availableDatesCount: availableDates.length,
                availableDates,
                availableTimes,
                nextAvailableDate:
                  nextAvailableDate?.toISOString().split('T')[0] || null,
                isAvailable: availableDates.length > 0,
              },
              routeStops:
                route.routeStops?.map((rs) => ({
                  id: rs.id,
                  order: rs.order,
                  stop: {
                    id: rs.stop.id,
                    name: rs.stop.name,
                    address: rs.stop.address || {
                      street: 'Endereço não informado',
                      city: 'Cidade não informada',
                      state: 'Estado não informado',
                      zipCode: '',
                    },
                  },
                  departureTime: rs.departureTime,
                })) || [],
              schedules: activeSchedules.map((s) => ({
                id: s.id,
                dayOfWeek: s.dayOfWeek,
                dayName: this.getDayName(s.dayOfWeek),
                isActive: s.isActive,
              })),
            };
          } catch (error) {
            console.error(`Erro ao processar rota ${route.id}:`, error);
            return {
              id: route.id,
              name: route.name,
              description: route.description,
              isActive: route.isActive,
              estimatedDuration: Number(route.estimatedDuration),
              distance: route.distance,
              availability: {
                hasActiveSchedules: false,
                activeSchedulesCount: 0,
                activeDaysOfWeek: [],
                availableDatesCount: 0,
                availableDates: [],
                availableTimes: [],
                nextAvailableDate: null,
                isAvailable: false,
                error: 'Erro ao calcular disponibilidade',
              },
              routeStops: [],
              schedules: [],
            };
          }
        }),
      );

      return routesWithAvailability;
    } catch (error) {
      console.error('Erro ao buscar rotas com disponibilidade:', error);
      return [];
    }
  }

  /**
   * Busca informações detalhadas de uma rota específica
   */
  async getRouteAvailabilityDetails(
    routeId: string,
    companyId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any> {
    try {
      const route = await this.routeRepository.findOne({
        where: { id: routeId, companyId },
        relations: ['schedules', 'routeStops', 'routeStops.stop'],
      });

      if (!route) {
        throw new Error('Rota não encontrada');
      }

      const schedules = route.schedules?.filter((s) => s.isActive) || [];
      const availableTimes = await this.getRouteAvailableTimes(routeId);

      const start = startDate || new Date();
      const maxEndDate = new Date();
      maxEndDate.setDate(maxEndDate.getDate() + 30);
      const end = endDate && endDate <= maxEndDate ? endDate : maxEndDate;

      const availableDates =
        this.scheduleAvailabilityService.calculateAvailableDates(
          schedules,
          availableTimes,
          start,
          end,
        );

      return {
        route: {
          id: route.id,
          name: route.name,
          isActive: route.isActive,
        },
        schedules: {
          total: route.schedules?.length || 0,
          active: schedules.length,
          details: schedules.map((s) => ({
            id: s.id,
            dayOfWeek: s.dayOfWeek,
            dayName: this.getDayName(s.dayOfWeek),
            isActive: s.isActive,
          })),
        },
        availability: {
          availableTimes,
          availableDatesCount: availableDates.length,
          availableDates,
          period: {
            start: start.toISOString(),
            end: end.toISOString(),
          },
        },
        routeStops:
          route.routeStops?.map((rs) => ({
            order: rs.order,
            stopName: rs.stop.name,
            departureTime: rs.departureTime,
          })) || [],
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes da rota:', error);
      throw error;
    }
  }

  /**
   * Retorna horários disponíveis para uma rota
   */
  private async getRouteAvailableTimes(routeId: string): Promise<string[]> {
    const routeStops = await this.routeStopRepository.find({
      where: { routeId },
      order: { order: 'ASC' },
    });

    const firstStop = routeStops.find((stop) => stop.order === 1);
    const departureTime = firstStop?.departureTime || '08:00';
    return [departureTime];
  }

  /**
   * Helper para converter número do dia da semana para nome
   */
  private getDayName(dayOfWeek: number): string {
    const days = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ];
    return days[dayOfWeek] || 'Desconhecido';
  }
}
