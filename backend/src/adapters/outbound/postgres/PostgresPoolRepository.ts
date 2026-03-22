import { Pool as PgPool } from 'pg';
import { IPoolRepository }      from '../../../core/ports/outbound/IPoolRepository';
import { Pool, PoolMember }     from '../../../core/domain/pool';

function toPoolMember(row: Record<string, unknown>): PoolMember {
  return {
    shipId:   row.ship_id as string,
    cbBefore: Number(row.cb_before),
    cbAfter:  Number(row.cb_after),
  };
}

export class PostgresPoolRepository implements IPoolRepository {
  constructor(private readonly pool: PgPool) {}

  // createPool 
  async createPool(
    year:    number,
    members: PoolMember[]
  ): Promise<Pool> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // Insert pool header
      const { rows: poolRows } = await client.query(
        `INSERT INTO pools (year) VALUES ($1) RETURNING *`,
        [year]
      );
      const poolId    = poolRows[0].id as number;
      const createdAt = new Date(poolRows[0].created_at as string);

      // Insert all members
      const inserted: PoolMember[] = [];

      for (const member of members) {
        const { rows } = await client.query(
          `INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [poolId, member.shipId, member.cbBefore, member.cbAfter]
        );
        inserted.push(toPoolMember(rows[0]));
      }

      await client.query('COMMIT');

      const poolSum = members.reduce((s, m) => s + m.cbBefore, 0);

      return {
        id:        poolId,
        year,
        members:   inserted,
        poolSum:   parseFloat(poolSum.toFixed(4)),
        createdAt,
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // findById 
  async findById(poolId: number): Promise<Pool | null> {
    const { rows: poolRows } = await this.pool.query(
      `SELECT * FROM pools WHERE id = $1`,
      [poolId]
    );

    if (poolRows.length === 0) return null;

    const { rows: memberRows } = await this.pool.query(
      `SELECT * FROM pool_members WHERE pool_id = $1 ORDER BY ship_id`,
      [poolId]
    );

    const members = memberRows.map(toPoolMember);
    const poolSum = members.reduce((s, m) => s + m.cbBefore, 0);

    return {
      id:        poolRows[0].id as number,
      year:      Number(poolRows[0].year),
      members,
      poolSum:   parseFloat(poolSum.toFixed(4)),
      createdAt: new Date(poolRows[0].created_at as string),
    };
  }

  // find by year
  async findByYear(year: number): Promise<Pool[]> {
    const { rows: poolRows } = await this.pool.query(
      `SELECT * FROM pools WHERE year = $1 ORDER BY created_at DESC`,
      [year]
    );

    if (poolRows.length === 0) return [];

    return Promise.all(
      poolRows.map(async (p) => {
        const pool = await this.findById(p.id as number);
        return pool!;
      })
    );
  }
}