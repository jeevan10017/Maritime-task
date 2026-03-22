import { IPoolRepository }       from '../../ports/outbound/IPoolRepository';
import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { IBankingRepository }    from '../../ports/outbound/IBankingRepository';
import { Pool, CreatePoolInput } from '../../domain/pool';
import { greedyAllocate }        from './greedyAllocator';
import { DomainError }           from './SetBaseline';

export class CreatePool {
  constructor(
    private readonly poolRepo:       IPoolRepository,
    private readonly complianceRepo: IComplianceRepository,
    private readonly bankingRepo:    IBankingRepository
  ) {}

  async execute(input: CreatePoolInput): Promise<Pool> {
    const { year, members } = input;

    if (members.length < 2) {
      throw new DomainError('A pool must have at least 2 members.');
    }

    const ids    = members.map((m: { shipId: string; cbBefore: number }) => m.shipId);
    const unique = new Set(ids);
    if (unique.size !== ids.length) {
      throw new DomainError('Duplicate shipIds are not allowed in a pool.');
    }

    
    const resolvedMembers = await Promise.all(
      members.map(async (m: { shipId: string; cbBefore: number }) => {
        const snapshot = await this.complianceRepo.findSnapshot(m.shipId, year);
        if (!snapshot) {
          throw new DomainError(
            `Ship "${m.shipId}" has no compliance balance for year ${year}. ` +
            `Call GET /compliance/cb first.`,
            422
          );
        }

        
        const summary       = await this.bankingRepo.getSummary(m.shipId, year);
        const bankedApplied = summary.totalBanked - summary.totalRemaining;
        const adjustedCB    = parseFloat(
          (snapshot.cbGco2eq + bankedApplied).toFixed(4)
        );

        return { shipId: m.shipId, cbBefore: adjustedCB };
      })
    );

   
    const allocation = greedyAllocate(resolvedMembers);

    if (!allocation.valid) {
      throw new DomainError(allocation.reason ?? 'Pool allocation failed.', 422);
    }

    
    return this.poolRepo.createPool(year, allocation.members);
  }
}