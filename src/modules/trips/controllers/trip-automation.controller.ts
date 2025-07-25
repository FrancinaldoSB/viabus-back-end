import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompanyFilter } from '../../../common/decorators/company-filter.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import {
  ApiErrorCode,
  ApiResponseBuilder,
} from '../../../core/interfaces/api-response';
import { RouteService } from '../../routes/route.service';
import { CreateTicketByRouteDto } from '../../tickets/dto/create-ticket-by-route.dto';
import { TicketService } from '../../tickets/ticket.service';
import { TicketStatus } from '../../tickets/entities/ticket.entity';
import { TripAutomationService } from '../services/trip-automation.service';

@Controller('trip-automation')
@UseGuards(JwtAuthGuard)
export class TripAutomationController {
  constructor(
    private readonly tripAutomationService: TripAutomationService,
    private readonly routeService: RouteService,
    private readonly ticketService: TicketService,
  ) {}

  /**
   * Busca rotas ativas com suas datas disponíveis filtradas por empresa
   */
  @Get('available-routes')
  async getAvailableRoutes(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @CompanyFilter() companyId?: string,
  ) {
    try {
      if (!companyId) {
        throw new BadRequestException('Empresa não identificada');
      }

      // Buscar todas as rotas ativas da empresa
      const routes = await this.routeService.findAll(companyId);
      const activeRoutes = routes.filter((route) => route.isActive);

      if (activeRoutes.length === 0) {
        return ApiResponseBuilder.success(
          [],
          'Nenhuma rota ativa encontrada para esta empresa',
        );
      }

      // Para cada rota ativa, buscar datas disponíveis
      const routesWithAvailability = await Promise.all(
        activeRoutes.map(async (route) => {
          const start = startDate ? new Date(startDate) : new Date();
          const end = endDate
            ? new Date(endDate)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

          const availableDates =
            await this.tripAutomationService.getAvailableDatesForRoute(
              route.id,
              start,
              end,
            );

          return {
            id: route.id,
            name: route.name,
            description: route.description,
            isActive: route.isActive,
            routeStops:
              route.routeStops?.map((rs) => ({
                id: rs.id,
                order: rs.order,
                stop: {
                  id: rs.stop.id,
                  name: rs.stop.name,
                  address: rs.stop.address || {
                    street: 'Endereço não informado',
                    city: 'Cidade não informada',
                    state: 'Estado não informado',
                    zipCode: '',
                  },
                },
                departureTime: rs.departureTime,
              })) || [],
            availableDates,
          };
        }),
      );

      // Filtrar apenas rotas que têm datas disponíveis
      const availableRoutes = routesWithAvailability.filter(
        (route) => route.availableDates.length > 0,
      );

      return ApiResponseBuilder.success(
        availableRoutes,
        'Rotas disponíveis carregadas com sucesso',
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
   * Busca datas disponíveis para uma rota específica da empresa
   */
  @Get('routes/:routeId/available-dates')
  async getAvailableDatesForRoute(
    @Param('routeId') routeId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CompanyFilter() companyId?: string,
  ) {
    try {
      if (!companyId) {
        throw new BadRequestException('Empresa não identificada');
      }

      // Verificar se a rota pertence à empresa
      try {
        await this.routeService.findOne(routeId, companyId);
      } catch {
        return ApiResponseBuilder.error(
          ApiErrorCode.NOT_FOUND,
          'Rota não encontrada ou não pertence à empresa',
        );
      }

      const availableDates =
        await this.tripAutomationService.getAvailableDatesForRoute(
          routeId,
          new Date(startDate),
          new Date(endDate),
        );

      return ApiResponseBuilder.success(
        availableDates,
        'Datas disponíveis carregadas com sucesso',
      );
    } catch (error) {
      console.error('Erro ao buscar datas disponíveis:', error);
      return ApiResponseBuilder.error(
        ApiErrorCode.INTERNAL_ERROR,
        'Erro ao carregar datas disponíveis',
        error.message,
      );
    }
  }

  /**
   * Cria ticket usando rota e data (sistema cria viagem automaticamente)
   * Só permite criar tickets para rotas da empresa do usuário logado
   */
  @Post('create-ticket-by-route')
  async createTicketByRoute(
    @Body() createTicketDto: CreateTicketByRouteDto,
    @CompanyFilter() companyId?: string,
  ) {
    try {
      if (!companyId) {
        throw new BadRequestException('Empresa não identificada');
      }

      // Verificar se a rota pertence à empresa
      let route;
      try {
        route = await this.routeService.findOne(
          createTicketDto.routeId,
          companyId,
        );
      } catch {
        return ApiResponseBuilder.error(
          ApiErrorCode.NOT_FOUND,
          'Rota não encontrada ou não pertence à empresa',
        );
      }

      // Encontrar/criar a viagem usando o serviço de automação
      const trip = await this.tripAutomationService.findOrCreateTrip(
        createTicketDto.routeId,
        createTicketDto.travelDate,
        createTicketDto.departureTime,
        companyId,
      );

      return ApiResponseBuilder.success(
        {
          tripId: trip.id,
          routeName: route.name,
          departureTime: trip.departureTime.toISOString(),
          estimatedArrivalTime: trip.estimatedArrivalTime.toISOString(),
          routeDescription: route.description,
          isAutoGenerated: trip.isAutoGenerated,
        },
        'Viagem encontrada/criada com sucesso. Próximo passo: criar ticket.',
      );
    } catch (error) {
      console.error('Erro ao criar ticket por rota:', error);
      return ApiResponseBuilder.error(
        ApiErrorCode.INTERNAL_ERROR,
        'Erro ao processar agendamento',
        error.message,
      );
    }
  }

  /**
   * Endpoint integrado que cria a viagem automaticamente (se necessário) e o ticket em uma única operação
   */
  @Post('schedule-trip')
  async scheduleTrip(
    @Body() createTicketDto: CreateTicketByRouteDto,
    @CompanyFilter() companyId?: string,
  ) {
    try {
      if (!companyId) {
        throw new BadRequestException('Empresa não identificada');
      }

      // Verificar se a rota pertence à empresa
      let route;
      try {
        route = await this.routeService.findOne(
          createTicketDto.routeId,
          companyId,
        );
      } catch {
        return ApiResponseBuilder.error(
          ApiErrorCode.NOT_FOUND,
          'Rota não encontrada ou não pertence à empresa',
        );
      }

      // Encontrar/criar a viagem automaticamente
      const trip = await this.tripAutomationService.findOrCreateTrip(
        createTicketDto.routeId,
        createTicketDto.travelDate,
        createTicketDto.departureTime,
        companyId,
      );

      // Preparar dados do ticket
      const ticketData = {
        tripId: trip.id,
        passengerName: createTicketDto.passengerName,
        passengerDocument: createTicketDto.passengerDocument,
        passengerPhone: createTicketDto.passengerPhone,
        passengerEmail: createTicketDto.passengerEmail,
        seatNumber: createTicketDto.seatNumber,
        price: createTicketDto.price || trip.basePrice || 0,
        status: createTicketDto.status || TicketStatus.RESERVED,
        boardingPointType: createTicketDto.boardingPointType,
        boardingStopId: createTicketDto.boardingStopId,
        boardingLocationDescription: createTicketDto.boardingLocationDescription,
        boardingLatitude: createTicketDto.boardingLatitude,
        boardingLongitude: createTicketDto.boardingLongitude,
        landingPointType: createTicketDto.landingPointType,
        landingStopId: createTicketDto.landingStopId,
        landingLocationDescription: createTicketDto.landingLocationDescription,
        landingLatitude: createTicketDto.landingLatitude,
        landingLongitude: createTicketDto.landingLongitude,
        observations: createTicketDto.observations,
      };

      // Criar o ticket
      const ticketResponse = await this.ticketService.createTicket(ticketData, companyId);

      // Verificar se o ticket foi criado com sucesso
      if (!ticketResponse.success) {
        return ApiResponseBuilder.error(
          ApiErrorCode.INTERNAL_ERROR,
          'Erro ao criar ticket',
          ticketResponse,
        );
      }

      // Atualizar contagem de assentos da viagem
      await this.tripAutomationService.updateTripSeats(trip.id);

      return ApiResponseBuilder.success(
        {
          ticket: (ticketResponse as any).data,
          trip: {
            id: trip.id,
            routeName: route.name,
            departureTime: trip.departureTime,
            estimatedArrivalTime: trip.estimatedArrivalTime,
            status: trip.status,
            isAutoGenerated: trip.isAutoGenerated,
          },
        },
        'Passagem agendada com sucesso! Viagem criada automaticamente.',
      );
    } catch (error) {
      console.error('Erro ao agendar viagem:', error);
      return ApiResponseBuilder.error(
        ApiErrorCode.INTERNAL_ERROR,
        'Erro ao agendar viagem',
        error.message,
      );
    }
  }
}
