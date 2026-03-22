import { ComplianceBalance } from '../../domain/compliance';

export interface IComplianceRepository {
  saveSnapshot(cb: ComplianceBalance): Promise<ComplianceBalance>;

  findSnapshot(shipId: string, year: number): Promise<ComplianceBalance | null>;
}