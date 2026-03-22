import { http } from './httpClient';
import { IRouteService } from '../../../core/ports/IRouteService';
import { Route, RouteFilters, RouteComparison } from '../../../core/domain/route';

interface RoutesResponse {
  status: string;
  count:  number;
  data:   Route[];
}

interface SingleRouteResponse {
  status: string;
  data:   Route;
}

interface ComparisonResponse {
  status: string;
  target: number;
  count:  number;
  data:   RouteComparison[];
}

export class RouteApiService implements IRouteService {
  async getRoutes(filters: RouteFilters): Promise<Route[]> {
    const params = new URLSearchParams();
    if (filters.vesselType) params.set('vesselType', filters.vesselType);
    if (filters.fuelType)   params.set('fuelType',   filters.fuelType);
    if (filters.year)       params.set('year',        String(filters.year));

    const query = params.toString();
    const res   = await http.get<RoutesResponse>(
      `/routes${query ? `?${query}` : ''}`
    );
    return res.data;
  }

  async setBaseline(routeId: number): Promise<Route> {
    const res = await http.post<SingleRouteResponse>(
      `/routes/${routeId}/baseline`
    );
    return res.data;
  }

  async getComparison(): Promise<RouteComparison[]> {
    const res = await http.get<ComparisonResponse>('/routes/comparison');
    return res.data;
  }
}