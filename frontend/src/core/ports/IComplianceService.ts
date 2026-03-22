// Outbound port for compliance services

import { ComplianceBalance, RouteComparison, ComplianceFilters } from '../domain/compliance';

export interface IComplianceService {
  getBalance(shipId: string, year: number): Promise<ComplianceBalance | null>;
  getComparisons(filters?: ComplianceFilters): Promise<RouteComparison[]>;
}
