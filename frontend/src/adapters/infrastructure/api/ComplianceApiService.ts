import { http } from './httpClient';
import { IComplianceService } from '../../../core/ports/IComplianceService';
import { ComplianceBalance, RouteComparison, ComplianceFilters } from '../../../core/domain/compliance';

interface ComplianceResponse {
  status: string;
  data:   ComplianceBalance;
}

interface ComparisonsResponse {
  status: string;
  target: number;
  data:   RouteComparison[];
}

export class ComplianceApiService implements IComplianceService {
  async getBalance(shipId: string, year: number): Promise<ComplianceBalance | null> {
    try {
      const res = await http.get<ComplianceResponse>(
        `/compliance/cb?shipId=${shipId}&year=${year}`
      );
      return res.data;
    } catch {
      return null;
    }
  }

  async getComparisons(filters?: ComplianceFilters): Promise<RouteComparison[]> {
    const params = new URLSearchParams();
    if (filters?.year) params.set('year', String(filters.year));
    if (filters?.shipId) params.set('shipId', filters.shipId);

    const query = params.toString();
    const res = await http.get<ComparisonsResponse>(
      `/compliance/comparison${query ? `?${query}` : ''}`
    );
    return res.data;
  }
}
