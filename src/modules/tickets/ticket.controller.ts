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
import {
  CreateTicketByRouteDto,
  CreateTicketDto,
} from './dto/create-ticket.dto';
import { QueryTicketDto } from './dto/query-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ITicketResponse } from './interfaces/ticket.interface.dto';
import { TicketService } from './ticket.service';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTicketDto: CreateTicketDto,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<ITicketResponse>> {
    return this.ticketService.createTicket(createTicketDto, companyId);
  }

  @Post('schedule-by-route')
  @HttpCode(HttpStatus.CREATED)
  async scheduleByRoute(
    @Body() createTicketDto: CreateTicketByRouteDto,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<ITicketResponse>> {
    return this.ticketService.createTicketByRoute(createTicketDto, companyId);
  }

  @Get()
  async findAll(
    @Query() query: QueryTicketDto,
    @CompanyFilter() companyId: string,
  ): Promise<PaginatedResponse<ITicketResponse>> {
    return this.ticketService.findAllWithFilters(companyId, query);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<ITicketResponse>> {
    return this.ticketService.findTicketById(id, companyId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<ITicketResponse>> {
    return this.ticketService.updateTicket(id, updateTicketDto, companyId);
  }

  @Patch(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<ITicketResponse>> {
    return this.ticketService.cancelTicket(id, companyId);
  }

  @Patch(':id/confirm')
  async confirm(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<ITicketResponse>> {
    return this.ticketService.confirmTicket(id, companyId);
  }

  @Patch(':id/complete')
  async complete(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<ApiResponse<ITicketResponse>> {
    return this.ticketService.completeTicket(id, companyId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CompanyFilter() companyId: string,
  ): Promise<void> {
    return this.ticketService.remove(id, companyId);
  }
}
