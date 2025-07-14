import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { TripStatus } from '../entities/trip.entity';

export class CreateTripBusDto {
  @IsString()
  @IsNotEmpty()
  busPlate: string;

  @IsString()
  @IsNotEmpty()
  busModel: string;

  @IsNumber()
  @Min(1)
  busCapacity: number;

  @IsUUID()
  @IsNotEmpty()
  primaryDriverId: string;

  @IsOptional()
  @IsUUID()
  secondaryDriverId?: string;

  @IsOptional()
  @IsString()
  observations?: string;
}

export class CreateTripDto {
  @IsUUID()
  @IsNotEmpty()
  routeId: string;

  @IsDateString()
  @IsNotEmpty()
  departureTime: string;

  @IsDateString()
  @IsNotEmpty()
  estimatedArrivalTime: string;

  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTripBusDto)
  buses: CreateTripBusDto[];
}
