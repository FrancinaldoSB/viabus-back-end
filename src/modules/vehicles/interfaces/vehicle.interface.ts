import {
  BusType,
  ComfortConfiguration,
  VehicleCategory,
  VehicleStatus,
} from '../entities/vehicle.entity';

export interface IVehicleResponse {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  capacity: number;
  category: VehicleCategory;
  comfortConfiguration: ComfortConfiguration;
  busType?: BusType;
  acquisitionDate: Date;
  odometer: number;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  status: VehicleStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
