interface Trip {
  id: number;
  route_id: number;
  driver_id: number;
  start_date: Date;
  end_date?: Date;
  status: string;
}