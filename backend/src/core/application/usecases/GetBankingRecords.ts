import { IBankingRepository } from '../../ports/outbound/IBankingRepository';
import { BankingSummary }     from '../../domain/banking';

export interface GetBankingRecordsInput {
  shipId: string;
  year:   number;
}

export class GetBankingRecords {
  constructor(private readonly bankingRepo: IBankingRepository) {}

  async execute(input: GetBankingRecordsInput): Promise<BankingSummary> {
    return this.bankingRepo.getSummary(input.shipId, input.year);
  }
}