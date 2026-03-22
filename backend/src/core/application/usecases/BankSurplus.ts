import { IBankingRepository } from '../../ports/outbound/IBankingRepository';
import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { BankEntry }          from '../../domain/banking';
import { DomainError }        from './SetBaseline';

export interface BankSurplusInput {
  shipId: string;
  year:   number;
  amount: number;
}

export class BankSurplus {
  constructor(
    private readonly bankingRepo:    IBankingRepository,
    private readonly complianceRepo: IComplianceRepository
  ) {}

  async execute(input: BankSurplusInput): Promise<BankEntry> {
    const { shipId, year, amount } = input;
    if (amount <= 0) {
      throw new DomainError('Amount to bank must be greater than 0');
    }

    const snapshot = await this.complianceRepo.findSnapshot(shipId, year);

    if (!snapshot) {
      throw new DomainError(
        `No compliance balance found for ship "${shipId}" year ${year}. ` +
        `Call GET /compliance/cb first.`,
        422
      );
    }

    if (snapshot.cbGco2eq <= 0) {
      throw new DomainError(
        `Ship "${shipId}" has a deficit CB of ${snapshot.cbGco2eq.toFixed(2)} gCO₂e. ` +
        `Only surplus CB can be banked.`
      );
    }
    if (amount > snapshot.cbGco2eq) {
      throw new DomainError(
        `Cannot bank ${amount} gCO₂e — available surplus is only ` +
        `${snapshot.cbGco2eq.toFixed(2)} gCO₂e.`
      );
    }

    return this.bankingRepo.createEntry(shipId, year, amount);
  }
}