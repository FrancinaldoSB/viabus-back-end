import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { VehicleStatus, VehicleCategory, ComfortConfiguration, BusType } from '../entities/vehicle.entity';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/, {
    message: 'Placa deve estar no formato ABC1234 ou ABC1D23',
  })
  plate: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  model: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  brand: string;

  @IsInt()
  @Min(1980)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsInt()
  @Min(1)
  @Max(300)
  capacity: number;

  @IsEnum(VehicleCategory)
  category: VehicleCategory;

  @IsEnum(ComfortConfiguration)
  comfortConfiguration: ComfortConfiguration;

  @ValidateIf((o) => o.category === VehicleCategory.LARGE)
  @IsEnum(BusType, {
    message: 'Tipo de ônibus é obrigatório para veículos de grande porte',
  })
  busType?: BusType;

  @IsDateString()
  @IsNotEmpty()
  acquisitionDate: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  odometer?: number;

  @IsOptional()
  @IsDateString()
  lastMaintenance?: string;

  @IsOptional()
  @IsDateString()
  nextMaintenance?: string;

  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
