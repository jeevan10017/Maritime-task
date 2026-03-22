import {
  BankingSummary,
  ApplyBankedResult,
  BankEntry,
  PoolResult,
} from '../domain/banking';

export interface IBankingService {
  getRecords(shipId: string, year: number): Promise<BankingSummary>;
  bankSurplus(shipId: string, year: number, amount: number): Promise<BankEntry>;
  applyBanked(shipId: string, year: number, amount: number): Promise<ApplyBankedResult>;
  createPool(year: number, shipIds: string[]): Promise<PoolResult>;
}