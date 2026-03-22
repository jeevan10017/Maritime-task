import { IBankingRepository }    from '../../ports/outbound/IBankingRepository';
import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { ApplyBankedResult }     from '../../domain/banking';
import { DomainError }           from './SetBaseline';

export interface ApplyBankedInput {
  shipId: string;
  year:   number;
  amount: number;
}

export class ApplyBanked {
  constructor(
    private readonly bankingRepo:    IBankingRepository,
    private readonly complianceRepo: IComplianceRepository
  ) {}

  async execute(input: ApplyBankedInput): Promise<ApplyBankedResult> {
    const { shipId, year, amount } = input;

    
    if (amount <= 0) {
      throw new DomainError('Amount to apply must be greater than 0');
    }


    const snapshot = await this.complianceRepo.findSnapshot(shipId, year);
    if (!snapshot) {
      throw new DomainError(
        `No compliance balance found for ship "${shipId}" year ${year}. ` +
        `Call GET /compliance/cb first.`,
        422
      );
    }

   
    if (snapshot.cbGco2eq >= 0) {
      throw new DomainError(
        `Ship "${shipId}" has a surplus CB of ${snapshot.cbGco2eq.toFixed(2)} gCO₂e. ` +
        `Banking application is only for deficit ships.`
      );
    }

 
    const summary = await this.bankingRepo.getSummary(shipId, year);

    if (summary.totalRemaining <= 0) {
      throw new DomainError(
        `No banked surplus available for ship "${shipId}" year ${year}.`
      );
    }

    if (amount > summary.totalRemaining) {
      throw new DomainError(
        `Cannot apply ${amount} gCO₂e — only ` +
        `${summary.totalRemaining.toFixed(2)} gCO₂e is available in the bank.`
      );
    }

    
    const consumed = await this.bankingRepo.consumeRemaining(
      shipId,
      year,
      amount
    );

    const cbBefore = snapshot.cbGco2eq;
    const cbAfter  = parseFloat((cbBefore + consumed).toFixed(4));

    // Refresh summary for remaining balance
    const updated = await this.bankingRepo.getSummary(shipId, year);

    return {
      shipId,
      year,
      applied:         consumed,
      remainingInBank: updated.totalRemaining,
      cbBefore,
      cbAfter,
    };
  }
}