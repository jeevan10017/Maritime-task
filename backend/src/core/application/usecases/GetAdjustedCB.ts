import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { IBankingRepository }    from '../../ports/outbound/IBankingRepository';
import { ComplianceBalance }     from '../../domain/compliance';
import { DomainError }           from './SetBaseline';

export interface GetAdjustedCBInput {
  shipId: string;
  year:   number;
}

export interface AdjustedCBResult {
  shipId:          string;
  year:            number;
  rawCB:           number;   
  bankedApplied:   number;   
  adjustedCB:      number;  
  status:          'surplus' | 'deficit' | 'exact';
}

export class GetAdjustedCB {
  constructor(
    private readonly complianceRepo: IComplianceRepository,
    private readonly bankingRepo:    IBankingRepository
  ) {}

  async execute(input: GetAdjustedCBInput): Promise<AdjustedCBResult> {
    const { shipId, year } = input;

    const snapshot = await this.complianceRepo.findSnapshot(shipId, year);

    if (!snapshot) {
      throw new DomainError(
        `No compliance balance for ship "${shipId}" year ${year}. ` +
        `Call GET /compliance/cb first.`,
        422
      );
    }


    const summary      = await this.bankingRepo.getSummary(shipId, year);
    const bankedApplied = parseFloat(
      (summary.totalBanked - summary.totalRemaining).toFixed(4)
    );

    const adjustedCB = parseFloat(
      (snapshot.cbGco2eq + bankedApplied).toFixed(4)
    );

    const status: AdjustedCBResult['status'] =
      adjustedCB > 0 ? 'surplus'
      : adjustedCB < 0 ? 'deficit'
      : 'exact';

    return {
      shipId,
      year,
      rawCB:        snapshot.cbGco2eq,
      bankedApplied,
      adjustedCB,
      status,
    };
  }
}