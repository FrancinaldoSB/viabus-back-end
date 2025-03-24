import {
  IsString,
  IsArray,
  IsUUID,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class RouteStopDto {
  @IsUUID()
  stopId: string;

  @IsNumber()
  order: number;

  @IsString()
  @IsOptional()
  departureTime: string;
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RouteStopDto)
  stops: RouteStopDto[];
}
