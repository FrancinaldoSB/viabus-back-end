import { PartialType } from '@nestjs/mapped-types';
import { CreateTripDto } from './create-trip.dto';
import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { TripStatus } from '../entities/trip.entity';

export class UpdateTripDto extends PartialType(CreateTripDto) {
  @IsOptional()
  @IsDateString()
  actualDepartureTime?: string;

  @IsOptional()
  @IsDateString()
  actualArrivalTime?: string;

  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus;
} 