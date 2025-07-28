import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Like, Repository } from 'typeorm';
import { BaseCompanyService } from '../../../common/base/base-company.service';
import {
  ApiResponse,
  ApiResponseBuilder,
  PaginatedResponse,
} from '../../../core/interfaces/api-response';
import { TripAutomationService } from '../../trips/services/trip-automation.service';
import {
  CreateTicketByRouteDto,
  CreateTicketDto,
} from '../dto/create-ticket.dto';
import { QueryTicketDto } from '../dto/query-ticket.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import { Ticket, TicketStatus } from '../entities/ticket.entity';
import {
  ITicketLocation,
  ITicketResponse,
} from '../interfaces/ticket.interface.dto';
import { BookingService } from './booking.service';

@Injectable()
export class TicketService extends BaseCompanyService<Ticket> {
  constructor(
    @InjectRepository(Ticket)
    protected readonly ticketRepository: Repository<Ticket>,
    private readonly bookingService: BookingService,
    private readonly tripAutomationService: TripAutomationService,
  ) {
    super(ticketRepository);
  }

  protected getEntityName(): string {
    return 'Passagem';
  }

  protected getDefaultFindOptions(): FindManyOptions<Ticket> {
    return {
      order: { createdAt: 'DESC' },
      relations: ['company'],
    };
  }

  async findAllWithFilters(
    companyId: string,
    query: QueryTicketDto,
  ): Promise<PaginatedResponse<ITicketResponse>> {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = { companyId };

    // Aplicar filtros
    if (query.passengerName) {
      where.passengerName = Like(`%${query.passengerName}%`);
    }

    if (query.passengerDocument) {
      where.passengerDocument = Like(`%${query.passengerDocument}%`);
    }

    if (query.passengerPhone) {
      where.passengerPhone = Like(`%${query.passengerPhone}%`);
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.tripId) {
      where.tripId = query.tripId;
    }

    if (query.dateFrom && query.dateTo) {
      where.createdAt = Between(
        new Date(query.dateFrom),
        new Date(query.dateTo),
      );
    } else if (query.dateFrom) {
      where.createdAt = Between(new Date(query.dateFrom), new Date());
    }

    const [tickets, total] = await this.ticketRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['company'],
    });

    const data: ITicketResponse[] = tickets.map(this.mapToResponse.bind(this));

    return ApiResponseBuilder.paginated<ITicketResponse>(data, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    });
  }

  async createTicket(
    createTicketDto: CreateTicketDto,
    companyId: string,
  ): Promise<ApiResponse<ITicketResponse>> {
    const ticket = await this.create(createTicketDto, companyId);
    const data = this.mapToResponse(ticket);
    return ApiResponseBuilder.success(data, 'Passagem criada com sucesso');
  }

  async updateTicket(
    id: string,
    updateTicketDto: UpdateTicketDto,
    companyId: string,
  ): Promise<ApiResponse<ITicketResponse>> {
    const ticket = await this.update(id, updateTicketDto, companyId);
    const data = this.mapToResponse(ticket);
    return ApiResponseBuilder.success(data, 'Passagem atualizada com sucesso');
  }

  async findTicketById(
    id: string,
    companyId: string,
  ): Promise<ApiResponse<ITicketResponse>> {
    const ticket = await this.findOne(id, companyId);
    const data = this.mapToResponse(ticket);
    return ApiResponseBuilder.success(data);
  }

  async cancelTicket(
    id: string,
    companyId: string,
  ): Promise<ApiResponse<ITicketResponse>> {
    const ticket = await this.update(
      id,
      { status: TicketStatus.CANCELLED },
      companyId,
    );
    const data = this.mapToResponse(ticket);
    return ApiResponseBuilder.success(data, 'Passagem cancelada com sucesso');
  }

  async confirmTicket(
    id: string,
    companyId: string,
  ): Promise<ApiResponse<ITicketResponse>> {
    const ticket = await this.update(
      id,
      { status: TicketStatus.CONFIRMED },
      companyId,
    );
    const data = this.mapToResponse(ticket);
    return ApiResponseBuilder.success(data, 'Passagem confirmada com sucesso');
  }

  async completeTicket(
    id: string,
    companyId: string,
  ): Promise<ApiResponse<ITicketResponse>> {
    const ticket = await this.update(
      id,
      { status: TicketStatus.COMPLETED },
      companyId,
    );
    const data = this.mapToResponse(ticket);
    return ApiResponseBuilder.success(data, 'Viagem completada com sucesso');
  }

  async createTicketByRoute(
    createTicketDto: CreateTicketByRouteDto,
    companyId: string,
  ): Promise<ApiResponse<ITicketResponse>> {
    try {
      // Buscar ou criar viagem usando TripAutomationService
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

      // Criar o ticket
      const ticketData = {
        tripId: trip.id,
        passengerName: createTicketDto.passengerName,
        passengerDocument: createTicketDto.passengerDocument,
        passengerPhone: createTicketDto.passengerPhone,
        passengerEmail: createTicketDto.passengerEmail,
        seatNumber: createTicketDto.seatNumber,
        price: createTicketDto.price,
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
        companyId,
      };

      const ticket = await this.ticketRepository.save(ticketData);

      const data = this.mapToResponse(ticket);

      return ApiResponseBuilder.success(data, 'Passagem agendada com sucesso!');
    } catch (error) {
      console.error('❌ TicketService: Erro em createTicketByRoute:', error);
      console.error('❌ TicketService: Stack trace:', error.stack);
      return ApiResponseBuilder.error(
        'INTERNAL_ERROR',
        'Erro interno ao processar agendamento',
        error.message,
      );
    }
  }

  private mapToResponse(ticket: Ticket): ITicketResponse {
    const boardingPoint: ITicketLocation = {
      type: ticket.boardingPointType,
      stopId: ticket.boardingStopId,
      locationDescription: ticket.boardingLocationDescription,
      latitude: ticket.boardingLatitude,
      longitude: ticket.boardingLongitude,
    };

    const landingPoint: ITicketLocation = {
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
