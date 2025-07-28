import { Injectable } from '@nestjs/common';
import { RouteSchedule } from '../../routes/entities/route-schedule.entity';

export interface AvailableDate {
  date: string;
  times: string[];
  dayOfWeek: number;
  dayName: string;
}

export interface AvailabilityInfo {
  hasActiveSchedules: boolean;
  activeSchedulesCount: number;
  activeDaysOfWeek: number[];
  availableDatesCount: number;
  availableDates: AvailableDate[];
  availableTimes: string[];
  nextAvailableDate: string | null;
  isAvailable: boolean;
  error?: string;
}

@Injectable()
export class ScheduleAvailabilityService {
  /**
   * Calcula as datas disponíveis para agendamento baseado nos schedules da rota
   * Limite máximo: 30 dias a partir da data inicial
   */
  calculateAvailableDates(
    schedules: RouteSchedule[],
    availableTimes: string[],
    startDate?: Date,
    endDate?: Date,
  ): AvailableDate[] {
    console.log('🔍 Calculando datas disponíveis:', {
      schedulesCount: schedules.length,
      availableTimes,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });

    // Define período padrão: de hoje até 30 dias no futuro
    const start = startDate || new Date();
    const maxEndDate = new Date();
    maxEndDate.setDate(maxEndDate.getDate() + 30); // Limite de 30 dias

    const end = endDate && endDate <= maxEndDate ? endDate : maxEndDate;

    // Filtra apenas schedules ativos
    const activeSchedules = schedules.filter((schedule) => schedule.isActive);

    console.log(
      '📅 Schedules ativos:',
      activeSchedules.map((s) => ({
        id: s.id,
        dayOfWeek: s.dayOfWeek,
        dayName: this.getDayName(s.dayOfWeek),
      })),
    );

    if (activeSchedules.length === 0) {
      console.log('❌ Nenhum schedule ativo encontrado');
      return [];
    }

    // Extrai os dias da semana ativos
    const activeDaysOfWeek = activeSchedules.map(
      (schedule) => schedule.dayOfWeek,
    );

    const availableDates: AvailableDate[] = [];
    const currentDate = new Date(start);

    // Garante que começamos hoje ou depois (ignorando horas)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (currentDate < today) {
      currentDate.setTime(today.getTime());
    }

    console.log('📆 Período de busca:', {
      start: currentDate.toISOString(),
      end: end.toISOString(),
      activeDaysOfWeek,
    });

    // Itera através dos dias até a data limite
    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();

      // Verifica se o dia da semana atual está nos schedules ativos
      if (activeDaysOfWeek.includes(dayOfWeek)) {
        const availableDate: AvailableDate = {
          date: this.formatDateToISO(currentDate),
          times: [...availableTimes], // Copia os horários disponíveis
          dayOfWeek,
          dayName: this.getDayName(dayOfWeek),
        };

        availableDates.push(availableDate);
        console.log('✅ Data disponível encontrada:', availableDate);
      }

      // Avança para o próximo dia
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`🎯 Total de datas disponíveis: ${availableDates.length}`);
    return availableDates;
  }

  /**
   * Verifica se uma data específica está disponível para agendamento
   */
  isDateAvailable(schedules: RouteSchedule[], targetDate: Date): boolean {
    const activeSchedules = schedules.filter((schedule) => schedule.isActive);

    if (activeSchedules.length === 0) {
      return false;
    }

    const dayOfWeek = targetDate.getDay();
    const activeDaysOfWeek = activeSchedules.map(
      (schedule) => schedule.dayOfWeek,
    );

    // Verifica se está dentro do limite de 30 dias
    const now = new Date();
    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 30);

    const isWithinLimit = targetDate >= now && targetDate <= maxDate;
    const isDayActive = activeDaysOfWeek.includes(dayOfWeek);

    return isWithinLimit && isDayActive;
  }

  /**
   * Retorna o próximo dia disponível para agendamento
   */
  getNextAvailableDate(schedules: RouteSchedule[]): Date | null {
    const availableDates = this.calculateAvailableDates(schedules, []);

    if (availableDates.length === 0) {
      return null;
    }

    return new Date(availableDates[0].date);
  }

  /**
   * Calcula informações completas de disponibilidade
   */
  calculateAvailabilityInfo(
    schedules: RouteSchedule[],
    availableTimes: string[],
    startDate?: Date,
    endDate?: Date,
  ): AvailabilityInfo {
    try {
      const activeSchedules = schedules.filter((schedule) => schedule.isActive);
      const availableDates = this.calculateAvailableDates(
        schedules,
        availableTimes,
        startDate,
        endDate,
      );
      const nextAvailableDate = this.getNextAvailableDate(schedules);

      return {
        hasActiveSchedules: activeSchedules.length > 0,
        activeSchedulesCount: activeSchedules.length,
        activeDaysOfWeek: activeSchedules.map((s) => s.dayOfWeek),
        availableDatesCount: availableDates.length,
        availableDates,
        availableTimes,
        nextAvailableDate:
          nextAvailableDate?.toISOString().split('T')[0] || null,
        isAvailable: availableDates.length > 0,
      };
    } catch (error) {
      console.error('❌ Erro ao calcular disponibilidade:', error);
      return {
        hasActiveSchedules: false,
        activeSchedulesCount: 0,
        activeDaysOfWeek: [],
        availableDatesCount: 0,
        availableDates: [],
        availableTimes,
        nextAvailableDate: null,
        isAvailable: false,
        error: error.message,
      };
    }
  }

  /**
   * Formata uma data para o formato ISO (YYYY-MM-DD)
   */
  private formatDateToISO(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Converte número do dia da semana para nome
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
