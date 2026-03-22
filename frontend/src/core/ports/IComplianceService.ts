import { ComplianceBalance, AdjustedCB } from '../domain/compliance';

export interface IComplianceService {
  computeCB(shipId: string, year: number): Promise<ComplianceBalance>;
  getAdjustedCB(shipId: string, year: number): Promise<AdjustedCB>;
}