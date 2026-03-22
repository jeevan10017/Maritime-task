// Outbound port for banking services

import { BankingSummary, BankSurplusInput, ApplyBankedInput } from '../domain/banking';

export interface IBankingService {
  getSummary(shipId: string, year: number): Promise<BankingSummary | null>;
  bankSurplus(input: BankSurplusInput): Promise<BankingSummary>;
  applyBanked(input: ApplyBankedInput): Promise<number>;
}
