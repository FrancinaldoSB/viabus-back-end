import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class RouteStopDto {
  @IsUUID()
  stopId: string;

  @IsNumber()
  order: number;

  @IsString()
  @IsOptional()
  departureTime?: string;
}

export class CreateRouteDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  estimatedDuration: string;

  @IsNumber()
  distance: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RouteStopDto)
  stops: RouteStopDto[];
}

export class UpdateRouteDto extends PartialType(CreateRouteDto) {}
