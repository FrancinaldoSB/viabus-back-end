import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { BaseCompanyService } from '../../common/base/base-company.service';
import {
  ApiResponse,
  ApiResponseBuilder,
  PaginatedResponse,
} from '../../core/interfaces/api-response';
import { CreateDriverDto } from './dto/create-driver.dto';
import { QueryDriverDto } from './dto/query-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver, DriverStatus } from './entities/driver.entity';
import { IDriverResponse } from './interfaces/driver.interface';

@Injectable()
export class DriverService extends BaseCompanyService<Driver> {
  constructor(
    @InjectRepository(Driver)
    protected readonly driverRepository: Repository<Driver>,
  ) {
    super(driverRepository);
  }

  protected getEntityName(): string {
    return 'Motorista';
  }

  protected getDefaultFindOptions(): FindManyOptions<Driver> {
    return {
      order: { name: 'ASC' },
      relations: ['company'],
    };
  }

  async findAllWithFilters(
    companyId: string,
    query: QueryDriverDto,
  ): Promise<PaginatedResponse<IDriverResponse>> {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = { companyId };

    // Aplicar filtros
    if (query.name) {
      where.name = Like(`%${query.name}%`);
    }

    if (query.cpf) {
      where.cpf = Like(`%${query.cpf}%`);
    }

    if (query.licenseNumber) {
      where.licenseNumber = Like(`%${query.licenseNumber}%`);
    }

    if (query.licenseCategory) {
      where.licenseCategory = query.licenseCategory;
    }

    if (query.status) {
      where.status = query.status;
    }

    const [drivers, total] = await this.driverRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { name: 'ASC' },
      relations: ['company'],
    });

    const data: IDriverResponse[] = drivers.map(this.mapToResponse.bind(this));

    return ApiResponseBuilder.paginated<IDriverResponse>(data, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    });
  }

  async createDriver(
    createDriverDto: CreateDriverDto,
    companyId: string,
  ): Promise<ApiResponse<IDriverResponse>> {
    const driver = await this.create(createDriverDto as unknown as Partial<Driver>, companyId);
    const data = this.mapToResponse(driver);
    return ApiResponseBuilder.success(data, 'Motorista criado com sucesso');
  }

  async updateDriver(
    id: string,
    updateDriverDto: UpdateDriverDto,
    companyId: string,
  ): Promise<ApiResponse<IDriverResponse>> {
    const driver = await this.update(id, updateDriverDto as Partial<Driver>, companyId);
    const data = this.mapToResponse(driver);
    return ApiResponseBuilder.success(data, 'Motorista atualizado com sucesso');
  }

  async findDriverById(
    id: string,
    companyId: string,
  ): Promise<ApiResponse<IDriverResponse>> {
    const driver = await this.findOne(id, companyId);
    const data = this.mapToResponse(driver);
    return ApiResponseBuilder.success(data);
  }

  async activateDriver(
    id: string,
    companyId: string,
  ): Promise<ApiResponse<IDriverResponse>> {
    const driver = await this.update(
      id,
      { status: DriverStatus.ACTIVE },
      companyId,
    );
    const data = this.mapToResponse(driver);
    return ApiResponseBuilder.success(data, 'Motorista ativado com sucesso');
  }

  async deactivateDriver(
    id: string,
    companyId: string,
  ): Promise<ApiResponse<IDriverResponse>> {
    const driver = await this.update(
      id,
      { status: DriverStatus.INACTIVE },
      companyId,
    );
    const data = this.mapToResponse(driver);
    return ApiResponseBuilder.success(data, 'Motorista desativado com sucesso');
  }

  async getActiveDrivers(
    companyId: string,
  ): Promise<ApiResponse<IDriverResponse[]>> {
    const drivers = await this.driverRepository.find({
      where: { companyId, status: DriverStatus.ACTIVE },
      order: { name: 'ASC' },
    });

    const data: IDriverResponse[] = drivers.map(this.mapToResponse.bind(this));
    return ApiResponseBuilder.success(data);
  }

  private mapToResponse(driver: Driver): IDriverResponse {
    return {
      id: driver.id,
      name: driver.name,
      cpf: driver.cpf,
      licenseNumber: driver.licenseNumber,
      licenseCategory: driver.licenseCategory,
      licenseExpiry: driver.licenseExpiry,
      phone: driver.phone,
      email: driver.email,
      birthDate: driver.birthDate,
      hireDate: driver.hireDate,
      status: driver.status,
      emergencyContactName: driver.emergencyContactName,
      emergencyContactPhone: driver.emergencyContactPhone,
      address: driver.address,
      notes: driver.notes,
      createdAt: driver.createdAt,
      updatedAt: driver.updatedAt,
    };
  }
}
