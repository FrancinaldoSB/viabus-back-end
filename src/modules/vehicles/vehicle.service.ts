import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { BaseCompanyService } from '../../common/base/base-company.service';
import {
  ApiResponse,
  ApiResponseBuilder,
  PaginatedResponse,
} from '../../core/interfaces/api-response';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { QueryVehicleDto } from './dto/query-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle, VehicleStatus } from './entities/vehicle.entity';
import { IVehicleResponse } from './interfaces/vehicle.interface';

@Injectable()
export class VehicleService extends BaseCompanyService<Vehicle> {
  constructor(
    @InjectRepository(Vehicle)
    protected readonly vehicleRepository: Repository<Vehicle>,
  ) {
    super(vehicleRepository);
  }

  protected getEntityName(): string {
    return 'Veículo';
  }

  protected getDefaultFindOptions(): FindManyOptions<Vehicle> {
    return {
      order: { plate: 'ASC' },
      relations: ['company'],
    };
  }

  async findAllWithFilters(
    companyId: string,
    query: QueryVehicleDto,
  ): Promise<PaginatedResponse<IVehicleResponse>> {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = { companyId };

    // Aplicar filtros
    if (query.plate) {
      where.plate = Like(`%${query.plate}%`);
    }

    if (query.model) {
      where.model = Like(`%${query.model}%`);
    }

    if (query.brand) {
      where.brand = Like(`%${query.brand}%`);
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.comfortConfiguration) {
      where.comfortConfiguration = query.comfortConfiguration;
    }

    if (query.busType) {
      where.busType = query.busType;
    }

    if (query.status) {
      where.status = query.status;
    }

    const [vehicles, total] = await this.vehicleRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { plate: 'ASC' },
      relations: ['company'],
    });

    const data: IVehicleResponse[] = vehicles.map(
      this.mapToResponse.bind(this),
    );

    return ApiResponseBuilder.paginated<IVehicleResponse>(data, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    });
  }

  async createVehicle(
    createVehicleDto: CreateVehicleDto,
    companyId: string,
  ): Promise<ApiResponse<IVehicleResponse>> {
    const vehicle = await this.create(
      createVehicleDto as unknown as Partial<Vehicle>,
      companyId,
    );
    const data = this.mapToResponse(vehicle);
    return ApiResponseBuilder.success(data, 'Veículo criado com sucesso');
  }

  async updateVehicle(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
    companyId: string,
  ): Promise<ApiResponse<IVehicleResponse>> {
    const vehicle = await this.update(
      id,
      updateVehicleDto as Partial<Vehicle>,
      companyId,
    );
    const data = this.mapToResponse(vehicle);
    return ApiResponseBuilder.success(data, 'Veículo atualizado com sucesso');
  }

  async findVehicleById(
    id: string,
    companyId: string,
  ): Promise<ApiResponse<IVehicleResponse>> {
    const vehicle = await this.findOne(id, companyId);
    const data = this.mapToResponse(vehicle);
    return ApiResponseBuilder.success(data);
  }

  async activateVehicle(
    id: string,
    companyId: string,
  ): Promise<ApiResponse<IVehicleResponse>> {
    const vehicle = await this.update(
      id,
      { status: VehicleStatus.ACTIVE },
      companyId,
    );
    const data = this.mapToResponse(vehicle);
    return ApiResponseBuilder.success(data, 'Veículo ativado com sucesso');
  }

  async deactivateVehicle(
    id: string,
    companyId: string,
  ): Promise<ApiResponse<IVehicleResponse>> {
    const vehicle = await this.update(
      id,
      { status: VehicleStatus.INACTIVE },
      companyId,
    );
    const data = this.mapToResponse(vehicle);
    return ApiResponseBuilder.success(data, 'Veículo desativado com sucesso');
  }

  async setMaintenanceMode(
    id: string,
    companyId: string,
  ): Promise<ApiResponse<IVehicleResponse>> {
    const vehicle = await this.update(
      id,
      { status: VehicleStatus.MAINTENANCE },
      companyId,
    );
    const data = this.mapToResponse(vehicle);
    return ApiResponseBuilder.success(data, 'Veículo em manutenção');
  }

  async getActiveVehicles(
    companyId: string,
  ): Promise<ApiResponse<IVehicleResponse[]>> {
    const vehicles = await this.vehicleRepository.find({
      where: { companyId, status: VehicleStatus.ACTIVE },
      order: { plate: 'ASC' },
    });

    const data: IVehicleResponse[] = vehicles.map(
      this.mapToResponse.bind(this),
    );
    return ApiResponseBuilder.success(data);
  }

  async updateOdometer(
    id: string,
    odometer: number,
    companyId: string,
  ): Promise<ApiResponse<IVehicleResponse>> {
    const vehicle = await this.update(id, { odometer }, companyId);
    const data = this.mapToResponse(vehicle);
    return ApiResponseBuilder.success(data, 'Hodômetro atualizado com sucesso');
  }

  private mapToResponse(vehicle: Vehicle): IVehicleResponse {
    return {
      id: vehicle.id,
      plate: vehicle.plate,
      model: vehicle.model,
      brand: vehicle.brand,
      year: vehicle.year,
      capacity: vehicle.capacity,
      category: vehicle.category,
      comfortConfiguration: vehicle.comfortConfiguration,
      busType: vehicle.busType,
      acquisitionDate: vehicle.acquisitionDate,
      odometer: vehicle.odometer,
      lastMaintenance: vehicle.lastMaintenance,
      nextMaintenance: vehicle.nextMaintenance,
      status: vehicle.status,
      notes: vehicle.notes,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
    };
  }
}
