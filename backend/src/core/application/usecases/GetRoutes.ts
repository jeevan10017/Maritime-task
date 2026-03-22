import { IRouteRepository } from '../../ports/outbound/IRouteRepository';
import { Route, RouteFilters } from '../../domain/route';

export class GetRoutes {
  constructor(private readonly routeRepo: IRouteRepository) {}

  async execute(filters: RouteFilters): Promise<Route[]> {
    return this.routeRepo.findAll(filters);
  }
}