import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  BusType,
  ComfortConfiguration,
  VehicleCategory,
  VehicleStatus,
} from '../entities/vehicle.entity';

export class QueryVehicleDto {
  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsEnum(VehicleCategory)
  category?: VehicleCategory;

  @IsOptional()
  @IsEnum(ComfortConfiguration)
  comfortConfiguration?: ComfortConfiguration;

  @IsOptional()
  @IsEnum(BusType)
  busType?: BusType;

  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
