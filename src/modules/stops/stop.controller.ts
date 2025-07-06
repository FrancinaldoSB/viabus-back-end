import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CompanyFilter } from '../../common/decorators/company-filter.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  CompanyFilterInterceptor,
  UseCompanyFilter,
} from '../../common/interceptors/company-filter.interceptor';
import { UserRole } from '../../core/enums/user-role.enum';
import {
  ApiResponseBuilder,
  ApiSuccessResponse,
  PaginatedResponse,
  PaginationParams,
} from '../../core/interfaces/api-response';
import { CreateStopDto } from './dto/create-stop.dto';
import { Stop } from './entities/stop.entity';
import { StopsService } from './stop.service';

@Controller('stops')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(CompanyFilterInterceptor)
export class StopsController {
  private readonly logger = new Logger(StopsController.name);

  constructor(private readonly stopsService: StopsService) {}

  @Get()
  @UseCompanyFilter()
  async getAllStops(
    @CompanyFilter() companyId: string,
    @Query() pagination: PaginationParams,
  ): Promise<PaginatedResponse<Stop>> {
    const { page = 1, limit = 10, sortBy, sortOrder } = pagination;

    this.logger.debug(
      `Getting all stops for company: ${companyId}, page: ${page}, limit: ${limit}`,
    );

    const [stops, total] = await this.stopsService.findAndCount(companyId, {
      page,
      limit,
      sortBy,
      sortOrder,
    });

    const paginationMeta = ApiResponseBuilder.createPaginationMeta(
      page,
      limit,
      total,
      { requestId: `stops-${Date.now()}` },
    );

    return ApiResponseBuilder.paginated(
      stops,
      paginationMeta,
      `${total} paradas encontradas`,
    );
  }

  @Get(':id')
  @UseCompanyFilter()
  async getStop(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiSuccessResponse<Stop>> {
    this.logger.debug(`Getting stop ${id} for company: ${companyId}`);

    const stop = await this.stopsService.findOne(id, companyId);

    return ApiResponseBuilder.success(stop, 'Parada encontrada com sucesso');
  }

  @Post()
  @UseCompanyFilter()
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async createStop(
    @Body() createStopDto: CreateStopDto,
    @CompanyFilter() companyId: string,
  ): Promise<ApiSuccessResponse<Stop>> {
    this.logger.debug(`Creating stop with companyId: ${companyId}`);

    const stop = await this.stopsService.createStop(createStopDto, companyId);

    return ApiResponseBuilder.success(stop, 'Parada criada com sucesso', {
      requestId: `create-stop-${Date.now()}`,
      executionTime: Date.now(),
    });
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @UseCompanyFilter()
  async updateStop(
    @Param('id') id: string,
    @Body() updateStopDto: Partial<CreateStopDto>,
    @CompanyFilter() companyId: string,
  ): Promise<ApiSuccessResponse<Stop>> {
    this.logger.debug(`Updating stop ${id} for company: ${companyId}`);

    const stop = await this.stopsService.updateStop(
      id,
      updateStopDto,
      companyId,
    );

    return ApiResponseBuilder.success(stop, 'Parada atualizada com sucesso');
  }

  @Delete(':id')
  @UseCompanyFilter()
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async removeStop(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiSuccessResponse<{ id: string }>> {
    this.logger.debug(`Removing stop ${id} for company: ${companyId}`);

    await this.stopsService.remove(id, companyId);

    return ApiResponseBuilder.success({ id }, 'Parada removida com sucesso');
  }

  // Método adicional para buscar paradas ativas
  @Get('active/list')
  @UseCompanyFilter()
  async getActiveStops(
    @CompanyFilter() companyId: string,
  ): Promise<ApiSuccessResponse<Stop[]>> {
    this.logger.debug(`Getting active stops for company: ${companyId}`);

    const stops = await this.stopsService.findActiveStops(companyId);

    return ApiResponseBuilder.success(
      stops,
      `${stops.length} paradas ativas encontradas`,
    );
  }
}
