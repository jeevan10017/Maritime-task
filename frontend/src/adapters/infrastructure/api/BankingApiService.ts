import { http } from './httpClient';
import { IBankingService } from '../../../core/ports/IBankingService';
import { BankingSummary, BankSurplusInput, ApplyBankedInput } from '../../../core/domain/banking';

interface SummaryResponse {
  status: string;
  data:   BankingSummary;
}

interface AmountResponse {
  status: string;
  data:   number;
}

export class BankingApiService implements IBankingService {
  async getSummary(shipId: string, year: number): Promise<BankingSummary | null> {
    try {
      const res = await http.get<SummaryResponse>(
        `/banking/summary?shipId=${shipId}&year=${year}`
      );
      return res.data;
    } catch {
      return null;
    }
  }

  async bankSurplus(input: BankSurplusInput): Promise<BankingSummary> {
    const res = await http.post<SummaryResponse>('/banking/bank', input);
    return res.data;
  }

  async applyBanked(input: ApplyBankedInput): Promise<number> {
    const res = await http.post<AmountResponse>('/banking/apply', input);
    return res.data;
  }
}
