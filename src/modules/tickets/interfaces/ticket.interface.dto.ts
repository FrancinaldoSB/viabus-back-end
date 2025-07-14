export interface ITicketLocation {
  type: 'official_stop' | 'specific_location';
  stopId?: string;
  stopName?: string;
  locationDescription?: string;
  latitude?: number;
  longitude?: number;
}

export interface ITicketResponse {
  id: string;
  tripId: string;
  passengerName: string;
  passengerDocument?: string;
  passengerPhone: string;
  passengerEmail?: string;
  seatNumber?: string;
  price: number;
  status: 'reserved' | 'confirmed' | 'cancelled' | 'completed';
  boardingPoint: ITicketLocation;
  landingPoint: ITicketLocation;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITicketFilters {
  passengerName?: string;
  passengerDocument?: string;
  status?: string;
  tripId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
