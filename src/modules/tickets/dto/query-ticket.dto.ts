import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TicketStatus } from '../entities/ticket.entity';

export class QueryTicketDto {
  @IsOptional()
  @IsString()
  passengerName?: string;

  @IsOptional()
  @IsString()
  passengerDocument?: string;

  @IsOptional()
  @IsString()
  passengerPhone?: string;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @IsUUID()
  tripId?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
