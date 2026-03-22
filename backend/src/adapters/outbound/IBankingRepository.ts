import { BankEntry, BankingSummary } from '../../domain/banking';

export interface IBankingRepository {

  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;

  // Persist a new bank entry
  createEntry(
    shipId: string,
    year:   number,
    amount: number
  ): Promise<BankEntry>;

  consumeRemaining(
    shipId: string,
    year:   number,
    amount: number
  ): Promise<number>;

  // Aggregated totals
  getSummary(shipId: string, year: number): Promise<BankingSummary>;
}