import { http } from './httpClient';
import { IComplianceService } from '../../../core/ports/IComplianceService';
import { ComplianceBalance, AdjustedCB } from '../../../core/domain/compliance';

export class ComplianceApiService implements IComplianceService {
  async computeCB(shipId: string, year: number): Promise<ComplianceBalance> {
    const res = await http.get<{ status: string; data: ComplianceBalance }>(
      `/compliance/cb?shipId=${shipId}&year=${year}`
    );
    return res.data;
  }

  async getAdjustedCB(shipId: string, year: number): Promise<AdjustedCB> {
    const res = await http.get<{ status: string; data: AdjustedCB }>(
      `/compliance/adjusted-cb?shipId=${shipId}&year=${year}`
    );
    return res.data;
  }
}