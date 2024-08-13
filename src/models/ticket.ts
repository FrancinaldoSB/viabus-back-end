interface Ticket {
  id: number;
  user_id: number;
  trip_id: number;
  boarding_stop_id: number;
  arrival_stop_id: number;
  status: string;
  additional_notes?: string;
  created_at: Date;
}