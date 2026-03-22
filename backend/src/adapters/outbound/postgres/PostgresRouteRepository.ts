import { Pool } from 'pg';
import { IRouteRepository } from '../../../core/ports/outbound/IRouteRepository';
import { Route, RouteFilters, VesselType, FuelType } from '../../../core/domain/route';

// Maps a raw DB row -domain entity (camelCase, proper types)
function toRoute(row: Record<string, unknown>): Route {
  return {
    id:              row.id as number,
    routeId:         row.route_id as string,
    vesselType:      row.vessel_type as VesselType,
    fuelType:        row.fuel_type as FuelType,
    year:            Number(row.year),
    ghgIntensity:    Number(row.ghg_intensity),
    fuelConsumption: Number(row.fuel_consumption),
    distance:        Number(row.distance),
    totalEmissions:  Number(row.total_emissions),
    isBaseline:      row.is_baseline as boolean,
    createdAt:       new Date(row.created_at as string),
    updatedAt:       new Date(row.updated_at as string),
  };
}

export class PostgresRouteRepository implements IRouteRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(filters: RouteFilters): Promise<Route[]> {
    const conditions: string[] = [];
    const values: unknown[]    = [];
    let   paramIndex           = 1;

    if (filters.vesselType) {
      conditions.push(`vessel_type = $${paramIndex++}`);
      values.push(filters.vesselType);
    }
    if (filters.fuelType) {
      conditions.push(`fuel_type = $${paramIndex++}`);
      values.push(filters.fuelType);
    }
    if (filters.year) {
      conditions.push(`year = $${paramIndex++}`);
      values.push(filters.year);
    }

    const where  = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const sql    = `
      SELECT * FROM routes
      ${where}
      ORDER BY year ASC, route_id ASC
    `;

    const { rows } = await this.pool.query(sql, values);
    return rows.map(toRoute);
  }

  async findById(id: number): Promise<Route | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM routes WHERE id = $1',
      [id]
    );
    return rows.length > 0 ? toRoute(rows[0]) : null;
  }

  async setBaseline(id: number): Promise<Route> {
    // Atomic swap — clear old baseline, set new one
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // Clear any existing baseline first
      await client.query(
        `UPDATE routes SET is_baseline = FALSE, updated_at = NOW()
         WHERE is_baseline = TRUE`
      );

      // Set the new baseline
      const { rows } = await client.query(
        `UPDATE routes
         SET is_baseline = TRUE, updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      await client.query('COMMIT');
      return toRoute(rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}