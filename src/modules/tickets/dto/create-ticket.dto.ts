import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { BoardingPointType, TicketStatus } from '../entities/ticket.entity';

export class CreateTicketDto {
  @IsUUID()
  @IsNotEmpty()
  tripId: string;

  @IsString()
  @IsNotEmpty()
  passengerName: string;

  @IsOptional()
  @IsString()
  passengerDocument?: string;

  @IsString()
  @IsNotEmpty()
  passengerPhone: string;

  @IsOptional()
  @IsEmail()
  passengerEmail?: string;

  @IsOptional()
  @IsString()
  seatNumber?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  // Embarque
  @IsEnum(BoardingPointType)
  boardingPointType: BoardingPointType;

  @IsOptional()
  @IsUUID()
  boardingStopId?: string;

  @IsOptional()
  @IsString()
  boardingLocationDescription?: string;

  @IsOptional()
  @IsNumber()
  boardingLatitude?: number;

  @IsOptional()
  @IsNumber()
  boardingLongitude?: number;

  // Desembarque
  @IsEnum(BoardingPointType)
  landingPointType: BoardingPointType;

  @IsOptional()
  @IsUUID()
  landingStopId?: string;

  @IsOptional()
  @IsString()
  landingLocationDescription?: string;

  @IsOptional()
  @IsNumber()
  landingLatitude?: number;

  @IsOptional()
  @IsNumber()
  landingLongitude?: number;

  @IsOptional()
  @IsString()
  observations?: string;
}
