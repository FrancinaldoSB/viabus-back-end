import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
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
import { CreateRouteDto, UpdateRouteDto } from './dto/create-route.dto';
import { Route } from './entities/route.entity';
import { RouteService } from './route.service';

@Controller('routes')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(CompanyFilterInterceptor)
export class RoutesController {
  private readonly logger = new Logger(RoutesController.name);

  constructor(private readonly routesService: RouteService) {}

  @Get()
  @UseCompanyFilter()
  async getAllRoutes(
    @CompanyFilter() companyId: string,
    @Query() pagination: PaginationParams,
  ): Promise<PaginatedResponse<Route>> {
    const { page = 1, limit = 10, sortBy, sortOrder } = pagination;

    this.logger.debug(
      `Getting all routes for company: ${companyId}, page: ${page}, limit: ${limit}`,
    );

    const [routes, total] = await this.routesService.findAndCount(companyId, {
      page,
      limit,
      sortBy,
      sortOrder,
    });

    const paginationMeta = ApiResponseBuilder.createPaginationMeta(
      page,
      limit,
      total,
      { requestId: `routes-${Date.now()}` },
    );

    return ApiResponseBuilder.paginated(
      routes,
      paginationMeta,
      `${total} rotas encontradas`,
    );
  }

  @Get(':id')
  @UseCompanyFilter()
  async getRoute(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiSuccessResponse<Route>> {
    this.logger.debug(`Getting route ${id} for company: ${companyId}`);

    const route = await this.routesService.findOne(id, companyId);

    return ApiResponseBuilder.success(route, 'Rota encontrada com sucesso');
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @UseCompanyFilter()
  async createRoute(
    @Body() createRouteDto: CreateRouteDto,
    @CompanyFilter() companyId: string,
  ): Promise<ApiSuccessResponse<Route>> {
    this.logger.debug(`Creating route with companyId: ${companyId}`);

    const route = await this.routesService.create(
      createRouteDto,
      companyId,
    );

    return ApiResponseBuilder.success(route, 'Rota criada com sucesso', {
      requestId: `create-route-${Date.now()}`,
      executionTime: Date.now(),
    });
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @UseCompanyFilter()
  async updateRoute(
    @Param('id') id: string,
    @Body() updateRouteDto: UpdateRouteDto,
    @CompanyFilter() companyId: string,
  ): Promise<ApiSuccessResponse<Route>> {
    this.logger.debug(`Updating route ${id} for company: ${companyId}`);

    const route = await this.routesService.update(
      id,
      updateRouteDto,
      companyId,
    );

    return ApiResponseBuilder.success(route, 'Rota atualizada com sucesso');
  }

  @Delete(':id')
  @UseCompanyFilter()
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async removeRoute(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiSuccessResponse<{ id: string }>> {
    this.logger.debug(`Removing route ${id} for company: ${companyId}`);

    await this.routesService.remove(id, companyId);

    return ApiResponseBuilder.success({ id }, 'Rota removida com sucesso');
  }

  @Get('active/list')
  @UseCompanyFilter()
  async getActiveRoutes(
    @CompanyFilter() companyId: string,
  ): Promise<ApiSuccessResponse<Route[]>> {
    this.logger.debug(`Getting active routes for company: ${companyId}`);

    const routes = await this.routesService.findActiveRoutes(companyId);

    return ApiResponseBuilder.success(
      routes,
      `${routes.length} rotas ativas encontradas`,
    );
  }
}
