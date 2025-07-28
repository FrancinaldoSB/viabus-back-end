import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompanyFilter } from '../../../common/decorators/company-filter.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import {
  ApiErrorCode,
  ApiResponseBuilder,
} from '../../../core/interfaces/api-response';
import { AvailabilityService } from '../services/availability.service';

@Controller('availability')
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
  ) {}

  /**
   * Busca rotas ativas com suas datas disponíveis filtradas por empresa
   */
  @Get('routes')
  async getAvailableRoutes(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @CompanyFilter() companyId?: string,
  ) {
    try {
      if (!companyId) {
        throw new BadRequestException('Empresa não identificada');
      }

      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;

      const routesWithAvailability = await this.availabilityService.getRoutesWithAvailability(
        companyId,
        start,
        end,
      );

      if (routesWithAvailability.length === 0) {
        return ApiResponseBuilder.success(
          [],
          'Nenhuma rota ativa encontrada para esta empresa',
        );
      }

      return ApiResponseBuilder.success(
        routesWithAvailability,
        'Rotas carregadas com sucesso',
      );
    } catch (error) {
      console.error('Erro ao buscar rotas disponíveis:', error);
      return ApiResponseBuilder.error(
        ApiErrorCode.INTERNAL_ERROR,
        'Erro ao carregar rotas disponíveis',
        error.message,
      );
    }
  }

  /**
   * Endpoint de debug para verificar disponibilidade de uma rota específica
   */
  @Get('routes/:routeId/debug')
  async debugRouteAvailability(
    @Param('routeId') routeId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @CompanyFilter() companyId?: string,
  ) {
    try {
      if (!companyId) {
        throw new BadRequestException('Empresa não identificada');
      }

      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;

      const routeDetails = await this.availabilityService.getRouteAvailabilityDetails(
        routeId,
        companyId,
        start,
        end,
      );

      return ApiResponseBuilder.success(
        routeDetails,
        'Informações de debug carregadas com sucesso',
      );
    } catch (error) {
      console.error('Erro ao buscar informações de debug:', error);
      return ApiResponseBuilder.error(
        ApiErrorCode.INTERNAL_ERROR,
        'Erro ao carregar informações de debug',
        error.message,
      );
    }
  }
}
