import { RouteStop } from '../entities/route-stop.entity';

export interface Route {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  estimatedDuration: string;
  distance: number;
  stops: RouteStop[];
}
