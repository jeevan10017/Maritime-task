
import { Route, RouteFilters, RouteComparison } from '../domain/route';

export interface IRouteService {
  getRoutes(filters: RouteFilters): Promise<Route[]>;
  setBaseline(routeId: number): Promise<Route>;
  getComparison(): Promise<RouteComparison[]>;
}