import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TripService } from '../services/trip.service';
import { CreateTripDto } from '../dto/create-trip.dto';
import { UpdateTripDto } from '../dto/update-trip.dto';
import { QueryTripDto } from '../dto/query-trip.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CompanyFilter } from '../../../common/decorators/company-filter.decorator';
import { ApiResponse, PaginatedResponse } from '../../../core/interfaces/api-response';
import { ITripResponse } from '../interfaces/trip.interface';

@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTripDto: CreateTripDto,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<ITripResponse>> {
    return this.tripService.createTrip(createTripDto, companyId);
  }

  @Get()
  async findAll(
    @Query() query: QueryTripDto,
    @CompanyFilter() companyId: string,
  ): Promise<PaginatedResponse<ITripResponse>> {
    return this.tripService.findAllWithFilters(companyId, query);
  }

  @Get('active')
  async findActive(
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<ITripResponse[]>> {
    return this.tripService.getActiveTrips(companyId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<ITripResponse>> {
    return this.tripService.findTripById(id, companyId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTripDto: UpdateTripDto,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<ITripResponse>> {
    return this.tripService.updateTrip(id, updateTripDto, companyId);
  }

  @Patch(':id/start')
  async start(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<ITripResponse>> {
    return this.tripService.startTrip(id, companyId);
  }

  @Patch(':id/complete')
  async complete(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<ITripResponse>> {
    return this.tripService.completeTrip(id, companyId);
  }

  @Patch(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<ITripResponse>> {
    return this.tripService.cancelTrip(id, companyId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<void> {
    return this.tripService.remove(id, companyId);
  }
} 