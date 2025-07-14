import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { BaseCompanyService } from '../../common/base/base-company.service';
import {
  ApiResponse,
  ApiResponseBuilder,
  PaginatedResponse,
} from '../../core/interfaces/api-response';
import { CreateTripDto } from './dto/create-trip.dto';
import { QueryTripDto } from './dto/query-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripBus } from './entities/trip-bus.entity';
import { Trip, TripStatus } from './entities/trip.entity';
import { ITripBusResponse, ITripResponse } from './interfaces/trip.interface';

@Injectable()
export class TripService extends BaseCompanyService<Trip> {
  constructor(
    @InjectRepository(Trip)
    protected readonly tripRepository: Repository<Trip>,
    @InjectRepository(TripBus)
    private readonly tripBusRepository: Repository<TripBus>,
  ) {
    super(tripRepository);
  }

  protected getEntityName(): string {
    return 'Viagem';
  }

  protected getDefaultFindOptions(): FindManyOptions<Trip> {
    return {
      order: { departureTime: 'ASC' },
      relations: [
        'route',
        'company',
        'tripBuses',
        'tripBuses.primaryDriver',
        'tripBuses.secondaryDriver',
      ],
    };
  }

  async findAllWithFilters(
    companyId: string,
    query: QueryTripDto,
  ): Promise<PaginatedResponse<ITripResponse>> {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = { companyId };

    // Aplicar filtros
    if (query.routeId) {
      where.routeId = query.routeId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.dateFrom && query.dateTo) {
      where.departureTime = Between(
        new Date(query.dateFrom),
        new Date(query.dateTo),
      );
    } else if (query.dateFrom) {
      where.departureTime = Between(
        new Date(query.dateFrom),
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      );
    }

    const [trips, total] = await this.tripRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { departureTime: 'ASC' },
      relations: [
        'route',
        'company',
        'tripBuses',
        'tripBuses.primaryDriver',
        'tripBuses.secondaryDriver',
        'tickets',
      ],
    });

    const data: ITripResponse[] = trips.map(this.mapToResponse.bind(this));

    return ApiResponseBuilder.paginated<ITripResponse>(data, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    });
  }

  async createTrip(
    createTripDto: CreateTripDto,
    companyId: string,
  ): Promise<ApiResponse<ITripResponse>> {
    // Calcular total de assentos dos ônibus
    const totalSeats = createTripDto.buses.reduce(
      (sum, bus) => sum + bus.busCapacity,
      0,
    );

    const tripData = {
      ...createTripDto,
      companyId,
      totalSeats,
      availableSeats: totalSeats,
      departureTime: new Date(createTripDto.departureTime),
      estimatedArrivalTime: new Date(createTripDto.estimatedArrivalTime),
    };

    const trip = await this.create(tripData, companyId);

    // Criar os ônibus da viagem
    for (const busDto of createTripDto.buses) {
      const tripBus = this.tripBusRepository.create({
        ...busDto,
        tripId: trip.id,
      });
      await this.tripBusRepository.save(tripBus);
    }

    // Recarregar a viagem com todas as relações
    const savedTrip = await this.findOne(trip.id, companyId);
    const data = this.mapToResponse(savedTrip);
    return ApiResponseBuilder.success(data, 'Viagem criada com sucesso');
  }

  async updateTrip(
    id: string,
    updateTripDto: UpdateTripDto,
    companyId: string,
  ): Promise<ApiResponse<ITripResponse>> {
    const updateData: any = { ...updateTripDto };

    if (updateTripDto.departureTime) {
      updateData.departureTime = new Date(updateTripDto.departureTime);
    }

    if (updateTripDto.estimatedArrivalTime) {
      updateData.estimatedArrivalTime = new Date(
        updateTripDto.estimatedArrivalTime,
      );
    }

    if (updateTripDto.actualDepartureTime) {
      updateData.actualDepartureTime = new Date(
        updateTripDto.actualDepartureTime,
      );
    }

    if (updateTripDto.actualArrivalTime) {
      updateData.actualArrivalTime = new Date(updateTripDto.actualArrivalTime);
    }

    const trip = await this.update(id, updateData, companyId);
    const data = this.mapToResponse(trip);
    return ApiResponseBuilder.success(data, 'Viagem atualizada com sucesso');
  }

  async findTripById(
    id: string,
    companyId: string,
  ): Promise<ApiResponse<ITripResponse>> {
    const trip = await this.findOne(id, companyId);
    const data = this.mapToResponse(trip);
    return ApiResponseBuilder.success(data);
  }

  async startTrip(
    id: string,
    companyId: string,
  ): Promise<ApiResponse<ITripResponse>> {
    const trip = await this.update(
      id,
      {
        status: TripStatus.IN_PROGRESS,
        actualDepartureTime: new Date(),
      },
      companyId,
    );
    const data = this.mapToResponse(trip);
    return ApiResponseBuilder.success(data, 'Viagem iniciada com sucesso');
  }

  async completeTrip(
    id: string,
    companyId: string,
  ): Promise<ApiResponse<ITripResponse>> {
    const trip = await this.update(
      id,
      {
        status: TripStatus.COMPLETED,
        actualArrivalTime: new Date(),
      },
      companyId,
    );
    const data = this.mapToResponse(trip);
    return ApiResponseBuilder.success(data, 'Viagem finalizada com sucesso');
  }

  async cancelTrip(
    id: string,
    companyId: string,
  ): Promise<ApiResponse<ITripResponse>> {
    const trip = await this.update(
      id,
      { status: TripStatus.CANCELLED },
      companyId,
    );
    const data = this.mapToResponse(trip);
    return ApiResponseBuilder.success(data, 'Viagem cancelada com sucesso');
  }

  async getActiveTrips(
    companyId: string,
  ): Promise<ApiResponse<ITripResponse[]>> {
    const trips = await this.tripRepository.find({
      where: {
        companyId,
        status: TripStatus.SCHEDULED,
        departureTime: Between(
          new Date(),
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ),
      },
      order: { departureTime: 'ASC' },
      relations: [
        'route',
        'company',
        'tripBuses',
        'tripBuses.primaryDriver',
        'tripBuses.secondaryDriver',
        'tickets',
      ],
    });

    const data: ITripResponse[] = trips.map(this.mapToResponse.bind(this));
    return ApiResponseBuilder.success(data);
  }

  private mapToResponse(trip: Trip): ITripResponse {
    const buses: ITripBusResponse[] =
      trip.tripBuses?.map((bus) => ({
        id: bus.id,
        busPlate: bus.busPlate,
        busModel: bus.busModel,
        busCapacity: bus.busCapacity,
        primaryDriver: {
          id: bus.primaryDriver.id,
          name: bus.primaryDriver.name,
          licenseNumber: bus.primaryDriver.licenseNumber,
        },
        secondaryDriver: bus.secondaryDriver
          ? {
              id: bus.secondaryDriver.id,
              name: bus.secondaryDriver.name,
              licenseNumber: bus.secondaryDriver.licenseNumber,
            }
          : undefined,
        isActive: bus.isActive,
        observations: bus.observations,
      })) || [];

    return {
      id: trip.id,
      route: {
        id: trip.route.id,
        name: trip.route.name,
        description: trip.route.description,
      },
      departureTime: trip.departureTime,
      estimatedArrivalTime: trip.estimatedArrivalTime,
      actualDepartureTime: trip.actualDepartureTime,
      actualArrivalTime: trip.actualArrivalTime,
      status: trip.status,
      basePrice: Number(trip.basePrice),
      totalSeats: trip.totalSeats,
      availableSeats: trip.availableSeats,
      observations: trip.observations,
      buses,
      ticketCount: trip.tickets?.length || 0,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    };
  }
}
