import { Pool } from 'pg';
import { IComplianceRepository } from '../../../core/ports/outbound/IComplianceRepository';
import { ComplianceBalance }     from '../../../core/domain/compliance';

function toComplianceBalance(row: Record<string, unknown>): ComplianceBalance {
  const cb = Number(row.cb_gco2eq);
  return {
    shipId:          row.ship_id as string,
    year:            Number(row.year),
    targetIntensity: Number(row.target_intensity ?? 89.3368),
    actualIntensity: Number(row.actual_intensity  ?? 0),
    energyInScope:   Number(row.energy_in_scope   ?? 0),
    cbGco2eq:        cb,
    status:          cb > 0 ? 'surplus' : cb < 0 ? 'deficit' : 'exact',
    computedAt:      new Date(row.computed_at as string),
  };
}

export class PostgresComplianceRepository implements IComplianceRepository {
  constructor(private readonly pool: Pool) {}

  async saveSnapshot(cb: ComplianceBalance): Promise<ComplianceBalance> {
    const { rows } = await this.pool.query(
      `INSERT INTO ship_compliance
         (ship_id, year, cb_gco2eq, target_intensity,
          actual_intensity, energy_in_scope, computed_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (ship_id, year) DO UPDATE SET
         cb_gco2eq        = EXCLUDED.cb_gco2eq,
         target_intensity = EXCLUDED.target_intensity,
         actual_intensity = EXCLUDED.actual_intensity,
         energy_in_scope  = EXCLUDED.energy_in_scope,
         computed_at      = NOW()
       RETURNING *`,
      [
        cb.shipId,
        cb.year,
        cb.cbGco2eq,
        cb.targetIntensity,
        cb.actualIntensity,
        cb.energyInScope,
      ]
    );
    return toComplianceBalance(rows[0]);
  }

  async findSnapshot(
    shipId: string,
    year: number
  ): Promise<ComplianceBalance | null> {
    const { rows } = await this.pool.query(
      `SELECT * FROM ship_compliance
       WHERE ship_id = $1 AND year = $2
       ORDER BY computed_at DESC
       LIMIT 1`,
      [shipId, year]
    );
    return rows.length > 0 ? toComplianceBalance(rows[0]) : null;
  }
}