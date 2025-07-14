export interface ITripBusResponse {
  id: string;
  busPlate: string;
  busModel: string;
  busCapacity: number;
  primaryDriver: {
    id: string;
    name: string;
    licenseNumber: string;
  };
  secondaryDriver?: {
    id: string;
    name: string;
    licenseNumber: string;
  };
  isActive: boolean;
  observations?: string;
}

export interface ITripResponse {
  id: string;
  route: {
    id: string;
    name: string;
    description: string;
  };
  departureTime: Date;
  estimatedArrivalTime: Date;
  actualDepartureTime?: Date;
  actualArrivalTime?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'delayed';
  basePrice: number;
  totalSeats: number;
  availableSeats: number;
  observations?: string;
  buses: ITripBusResponse[];
  ticketCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITripFilters {
  routeId?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
