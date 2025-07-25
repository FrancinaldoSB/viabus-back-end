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

export class CreateTripVehicleDto {
  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;

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
  @Type(() => CreateTripVehicleDto)
  vehicles: CreateTripVehicleDto[];
}
