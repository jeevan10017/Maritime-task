import { BankEntry, BankingSummary } from '../../domain/banking';

// Outbound port for banking data persistence
export interface IBankingRepository {
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
  createEntry(shipId: string, year: number, amount: number): Promise<BankEntry>;
  consumeRemaining(shipId: string, year: number, amount: number): Promise<number>;
  getSummary(shipId: string, year: number): Promise<BankingSummary>;
}
