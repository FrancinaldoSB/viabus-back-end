import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompanyFilter } from '../../common/decorators/company-filter.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  ApiResponse,
  PaginatedResponse,
} from '../../core/interfaces/api-response';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { QueryVehicleDto } from './dto/query-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { IVehicleResponse } from './interfaces/vehicle.interface';
import { VehicleService } from './vehicle.service';

@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createVehicleDto: CreateVehicleDto,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<IVehicleResponse>> {
    return this.vehicleService.createVehicle(createVehicleDto, companyId);
  }

  @Get()
  async findAll(
    @Query() query: QueryVehicleDto,
    @CompanyFilter() companyId: string,
  ): Promise<PaginatedResponse<IVehicleResponse>> {
    return this.vehicleService.findAllWithFilters(companyId, query);
  }

  @Get('active')
  async findActive(
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<IVehicleResponse[]>> {
    return this.vehicleService.getActiveVehicles(companyId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<IVehicleResponse>> {
    return this.vehicleService.findVehicleById(id, companyId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<IVehicleResponse>> {
    return this.vehicleService.updateVehicle(id, updateVehicleDto, companyId);
  }

  @Patch(':id/activate')
  async activate(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<IVehicleResponse>> {
    return this.vehicleService.activateVehicle(id, companyId);
  }

  @Patch(':id/deactivate')
  async deactivate(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<IVehicleResponse>> {
    return this.vehicleService.deactivateVehicle(id, companyId);
  }

  @Patch(':id/maintenance')
  async setMaintenance(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<IVehicleResponse>> {
    return this.vehicleService.setMaintenanceMode(id, companyId);
  }

  @Patch(':id/odometer')
  async updateOdometer(
    @Param('id') id: string,
    @Body('odometer') odometer: number,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<IVehicleResponse>> {
    return this.vehicleService.updateOdometer(id, odometer, companyId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<void> {
    return this.vehicleService.remove(id, companyId);
  }
}
