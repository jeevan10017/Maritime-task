import { ComplianceBalance } from '../../domain/compliance';

// Outbound port for compliance data persistence
export interface IComplianceRepository {
  saveSnapshot(cb: ComplianceBalance): Promise<ComplianceBalance>;
  findSnapshot(shipId: string, year: number): Promise<ComplianceBalance | null>;
}
