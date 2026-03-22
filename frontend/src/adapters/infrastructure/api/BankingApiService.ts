import { http } from './httpClient';
import { IBankingService } from '../../../core/ports/IBankingService';
import {
  BankingSummary, ApplyBankedResult, BankEntry, PoolResult,
} from '../../../core/domain/banking';

export class BankingApiService implements IBankingService {
  async getRecords(shipId: string, year: number): Promise<BankingSummary> {
    const res = await http.get<{ status: string; data: BankingSummary }>(
      `/banking/records?shipId=${shipId}&year=${year}`
    );
    return res.data;
  }

  async bankSurplus(
    shipId: string, year: number, amount: number
  ): Promise<BankEntry> {
    const res = await http.post<{ status: string; data: BankEntry }>(
      '/banking/bank',
      { shipId, year, amount }
    );
    return res.data;
  }

  async applyBanked(
    shipId: string, year: number, amount: number
  ): Promise<ApplyBankedResult> {
    const res = await http.post<{ status: string; data: ApplyBankedResult }>(
      '/banking/apply',
      { shipId, year, amount }
    );
    return res.data;
  }

  async createPool(year: number, shipIds: string[]): Promise<PoolResult> {
    const res = await http.post<{ status: string; data: PoolResult }>(
      '/pools',
      { year, members: shipIds.map((shipId) => ({ shipId })) }
    );
    return res.data;
  }
}