import { Route, RouteFilters } from '../../domain/route';

// Outbound port 
export interface IRouteRepository {
  findAll(filters: RouteFilters): Promise<Route[]>;
  findById(id: number): Promise<Route | null>;
  setBaseline(id: number): Promise<Route>;
}