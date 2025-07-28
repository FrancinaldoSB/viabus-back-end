import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ApiResponse,
  ApiResponseBuilder,
} from '../../../core/interfaces/api-response';
import { RouteService } from '../../routes/route.service';
import { TripAutomationService } from '../../trips/services/trip-automation.service';
import { CreateTicketByRouteDto } from '../dto/create-ticket.dto';
import { Ticket, TicketStatus } from '../entities/ticket.entity';
import { ITicketResponse } from '../interfaces/ticket.interface.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly routeService: RouteService,
    private readonly tripAutomationService: TripAutomationService,
  ) {}

  async createBookingByRoute(
    createTicketDto: CreateTicketByRouteDto,
    companyId: string,
  ): Promise<ApiResponse<ITicketResponse>> {
    try {
      if (!companyId) {
        throw new BadRequestException('Empresa não identificada');
      }

      // Verificar se é um agendamento por rota
      if (!createTicketDto.routeId || !createTicketDto.travelDate) {
        return ApiResponseBuilder.error(
          'BAD_REQUEST',
          'Para agendamento por rota, routeId e travelDate são obrigatórios',
        );
      }

      // Verificar se a rota pertence à empresa
      let route;
      try {
        route = await this.routeService.findOne(
          createTicketDto.routeId,
          companyId,
        );
      } catch (error) {
        return ApiResponseBuilder.error(
          'NOT_FOUND',
          'Rota não encontrada ou não pertence à empresa',
        );
      }

      // Encontrar/criar a viagem automaticamente
      const trip = await this.tripAutomationService.findOrCreateTrip(
        createTicketDto.routeId,
        createTicketDto.travelDate,
        createTicketDto.departureTime,
        companyId,
      );

      if (!trip) {
        return ApiResponseBuilder.error(
          'TRIP_NOT_FOUND',
          'Não foi possível encontrar ou criar uma viagem para os dados fornecidos',
        );
      }

      // Preparar dados do ticket
      const ticketData = {
        tripId: trip.id,
        passengerName: createTicketDto.passengerName,
        passengerDocument: createTicketDto.passengerDocument,
        passengerPhone: createTicketDto.passengerPhone,
        passengerEmail: createTicketDto.passengerEmail,
        seatNumber: createTicketDto.seatNumber,
        price: createTicketDto.price || trip.basePrice || 0,
        status: createTicketDto.status || TicketStatus.RESERVED,
        boardingPointType: createTicketDto.boardingPointType,
        boardingStopId: createTicketDto.boardingStopId,
        boardingLocationDescription:
          createTicketDto.boardingLocationDescription,
        boardingLatitude: createTicketDto.boardingLatitude,
        boardingLongitude: createTicketDto.boardingLongitude,
        landingPointType: createTicketDto.landingPointType,
        landingStopId: createTicketDto.landingStopId,
        landingLocationDescription: createTicketDto.landingLocationDescription,
        landingLatitude: createTicketDto.landingLatitude,
        landingLongitude: createTicketDto.landingLongitude,
        observations: createTicketDto.observations,
      };

      // Criar o ticket
      let ticket;
      try {
        ticket = await this.ticketRepository.save({
          ...ticketData,
          companyId,
        });
      } catch (error) {
        throw error;
      }

      // Atualizar contagem de assentos da viagem
      try {
        await this.tripAutomationService.updateTripSeats(trip.id);
      } catch (error) {
        // Não falha o processo por erro nos assentos
      }

      // Mapear para resposta
      try {
        const ticketResponse = this.mapToResponse(ticket);

        return ApiResponseBuilder.success(
          ticketResponse,
          'Passagem agendada com sucesso! Viagem criada automaticamente.',
        );
      } catch (error) {
        throw error;
      }
    } catch (error) {
      return ApiResponseBuilder.error(
        'INTERNAL_ERROR',
        'Erro ao processar agendamento',
        error.message,
      );
    }
  }

  private mapToResponse(ticket: Ticket): ITicketResponse {
    const boardingPoint = {
      type: ticket.boardingPointType,
      stopId: ticket.boardingStopId,
      locationDescription: ticket.boardingLocationDescription,
      latitude: ticket.boardingLatitude,
      longitude: ticket.boardingLongitude,
    };

    const landingPoint = {
      type: ticket.landingPointType,
      stopId: ticket.landingStopId,
      locationDescription: ticket.landingLocationDescription,
      latitude: ticket.landingLatitude,
      longitude: ticket.landingLongitude,
    };

    return {
      id: ticket.id,
      tripId: ticket.tripId,
      passengerName: ticket.passengerName,
      passengerDocument: ticket.passengerDocument,
      passengerPhone: ticket.passengerPhone,
      passengerEmail: ticket.passengerEmail,
      seatNumber: ticket.seatNumber,
      price: Number(ticket.price),
      status: ticket.status,
      boardingPoint,
      landingPoint,
      observations: ticket.observations,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }
}
