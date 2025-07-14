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
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { QueryDriverDto } from './dto/query-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { IDriverResponse } from './interfaces/driver.interface';

@Controller('drivers')
@UseGuards(JwtAuthGuard)
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDriverDto: CreateDriverDto,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<IDriverResponse>> {
    return this.driverService.createDriver(createDriverDto, companyId);
  }

  @Get()
  async findAll(
    @Query() query: QueryDriverDto,
    @CompanyFilter() companyId: string,
  ): Promise<PaginatedResponse<IDriverResponse>> {
    return this.driverService.findAllWithFilters(companyId, query);
  }

  @Get('active')
  async findActive(
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<IDriverResponse[]>> {
    return this.driverService.getActiveDrivers(companyId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<IDriverResponse>> {
    return this.driverService.findDriverById(id, companyId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDriverDto: UpdateDriverDto,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<IDriverResponse>> {
    return this.driverService.updateDriver(id, updateDriverDto, companyId);
  }

  @Patch(':id/activate')
  async activate(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<IDriverResponse>> {
    return this.driverService.activateDriver(id, companyId);
  }

  @Patch(':id/deactivate')
  async deactivate(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<IDriverResponse>> {
    return this.driverService.deactivateDriver(id, companyId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<void> {
    return this.driverService.remove(id, companyId);
  }
}
