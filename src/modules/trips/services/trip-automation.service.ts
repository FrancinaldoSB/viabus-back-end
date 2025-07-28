import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteSchedule } from '../../routes/entities/route-schedule.entity';
import { RouteStop } from '../../routes/entities/route-stop.entity';
import { Route } from '../../routes/entities/route.entity';
import { Trip, TripStatus } from '../entities/trip.entity';
import { ScheduleAvailabilityService } from './schedule-availability.service';

@Injectable()
export class TripAutomationService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(RouteSchedule)
    private routeScheduleRepository: Repository<RouteSchedule>,
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
    @InjectRepository(RouteStop)
    private routeStopRepository: Repository<RouteStop>,
    private scheduleAvailabilityService: ScheduleAvailabilityService,
  ) {}

  /**
   * Encontra ou cria uma viagem para a rota e data especificadas
   */
  async findOrCreateTrip(
    routeId: string,
    travelDate: string,
    departureTime?: string,
    companyId?: string,
  ): Promise<Trip> {
    // Se departureTime não foi fornecido, busca automaticamente da primeira parada
    let actualDepartureTime = departureTime;
    if (!actualDepartureTime) {
      const firstStop = await this.routeStopRepository.findOne({
        where: { routeId, order: 1 },
      });

      // Se não encontrou parada ou o horário está null, usa horário padrão
      actualDepartureTime = firstStop?.departureTime || '08:00';
    }

    // Primeiro, verifica se já existe uma viagem para esta rota, data e horário
    const existingTrip = await this.findExistingTrip(
      routeId,
      travelDate,
      actualDepartureTime,
    );

    if (existingTrip) {
      return existingTrip;
    }

    // Se não existe, cria uma nova baseada no schedule e paradas
    return this.createTripFromRouteStops(
      routeId,
      travelDate,
      actualDepartureTime,
      companyId || '',
    );
  }

  /**
   * Busca uma viagem existente para rota, data e horário
   */
  private async findExistingTrip(
    routeId: string,
    travelDate: string,
    departureTime: string,
  ): Promise<Trip | null> {
    // Validar e criar a data corretamente
    const departureDateTime = new Date(`${travelDate}T${departureTime}`);

    // Verificar se a data é válida
    if (isNaN(departureDateTime.getTime())) {
      console.error('❌ Data inválida:', {
        travelDate,
        departureTime,
        departureDateTime,
      });
      return null;
    }

    return this.tripRepository.findOne({
      where: {
        routeId,
        departureTime: departureDateTime,
      },
      relations: ['route', 'tripVehicles'],
    });
  }

  /**
   * Cria uma nova viagem baseada nas paradas da rota
   */
  private async createTripFromRouteStops(
    routeId: string,
    travelDate: string,
    departureTime: string,
    companyId: string,
  ): Promise<Trip> {
    // Verifica se a rota está ativa no dia da semana
    const travelDateObj = new Date(`${travelDate}T00:00:00`);

    // Verificar se a data é válida
    if (isNaN(travelDateObj.getTime())) {
      throw new Error(`Data inválida: ${travelDate}`);
    }

    const dayOfWeek = travelDateObj.getDay();

    const schedule = await this.routeScheduleRepository.findOne({
      where: {
        routeId,
        dayOfWeek,
        isActive: true,
      },
    });

    if (!schedule) {
      console.log('❌ TripAutomationService: Schedule não encontrado');
      throw new Error(
        `Rota não está ativa no dia ${dayOfWeek} (${this.getDayName(dayOfWeek)})`,
      );
    }

    // Busca as paradas da rota para calcular horários
    const routeStops = await this.routeStopRepository.find({
      where: { routeId },
      order: { order: 'ASC' },
    });

    if (routeStops.length === 0) {
      console.log('❌ TripAutomationService: Rota não possui paradas');
      throw new Error('Rota não possui paradas configuradas');
    }

    // Calcula horário de partida
    let departureDateTime;
    try {
      departureDateTime = new Date(`${travelDate}T${departureTime}`);
    } catch (error) {
      console.error('❌ TripAutomationService: Erro ao criar data:', error);
      throw error;
    }

    // Calcula horário estimado de chegada (baseado na primeira parada)
    const firstStop = routeStops.find((stop) => stop.order === 1);

    let estimatedArrivalTime;
    try {
      estimatedArrivalTime = firstStop
        ? new Date(`${travelDate}T${firstStop.departureTime}`)
        : new Date(departureDateTime.getTime() + 2 * 60 * 60 * 1000); // +2 horas padrão
    } catch (error) {
      console.error(
        '❌ TripAutomationService: Erro ao calcular horário de chegada:',
        error,
      );
      throw error;
    }

    // Cria a viagem
    let trip;
    try {
      trip = this.tripRepository.create({
        routeId,
        companyId,
        departureTime: departureDateTime,
        estimatedArrivalTime,
        status: TripStatus.SCHEDULED,
        isAutoGenerated: true,
        basePrice: 0, // Será calculado baseado na rota
      });
    } catch (error) {
      console.error(
        '❌ TripAutomationService: Erro ao criar objeto da viagem:',
        error,
      );
      throw error;
    }

    let savedTrip;
    try {
      savedTrip = await this.tripRepository.save(trip);
    } catch (error) {
      console.error('❌ TripAutomationService: Erro ao salvar viagem:', error);
      throw error;
    }

    return savedTrip;
  }

  /**
   * Atualiza a contagem de assentos de uma viagem
   */
  async updateTripSeats(tripId: string): Promise<void> {
    // TODO: Implementar lógica de contagem de assentos
    console.log(`Atualizando assentos da viagem ${tripId}`);
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
