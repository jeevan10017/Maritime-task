import { Pool } from 'pg';
import { IBankingRepository }         from '../../../core/ports/outbound/IBankingRepository';
import { BankEntry, BankingSummary }  from '../../../core/domain/banking';

function toEntry(row: Record<string, unknown>): BankEntry {
  return {
    id:           row.id as number,
    shipId:       row.ship_id as string,
    year:         Number(row.year),
    amountGco2eq: Number(row.amount_gco2eq),
    remaining:    Number(row.remaining),
    createdAt:    new Date(row.created_at as string),
  };
}

export class PostgresBankingRepository implements IBankingRepository {
  constructor(private readonly pool: Pool) {}

  // ── findByShipAndYear ──────────────────────────────────────
  async findByShipAndYear(
    shipId: string,
    year:   number
  ): Promise<BankEntry[]> {
    const { rows } = await this.pool.query(
      `SELECT * FROM bank_entries
       WHERE ship_id = $1 AND year = $2
       ORDER BY created_at ASC`,
      [shipId, year]
    );
    return rows.map(toEntry);
  }

  // ── createEntry ────────────────────────────────────────────
  async createEntry(
    shipId: string,
    year:   number,
    amount: number
  ): Promise<BankEntry> {
    const { rows } = await this.pool.query(
      `INSERT INTO bank_entries (ship_id, year, amount_gco2eq, remaining)
       VALUES ($1, $2, $3, $3)
       RETURNING *`,
      [shipId, year, amount]
    );
    return toEntry(rows[0]);
  }


  async consumeRemaining(
    shipId: string,
    year:   number,
    amount: number
  ): Promise<number> {
    // Fetch all entries that still have remaining balance, oldest first
    const { rows } = await this.pool.query(
      `SELECT * FROM bank_entries
       WHERE ship_id = $1 AND year = $2 AND remaining > 0
       ORDER BY created_at ASC
       FOR UPDATE`,  // row-level lock for concurrent safety
      [shipId, year]
    );

    const client = await this.pool.connect();
    let toConsume = amount;
    let consumed  = 0;

    try {
      await client.query('BEGIN');

      for (const row of rows) {
        if (toConsume <= 0) break;

        const entry     = toEntry(row);
        const deduct    = Math.min(entry.remaining, toConsume);
        const newRemain = parseFloat((entry.remaining - deduct).toFixed(4));

        await client.query(
          `UPDATE bank_entries SET remaining = $1 WHERE id = $2`,
          [newRemain, entry.id]
        );

        consumed  += deduct;
        toConsume -= deduct;
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    return parseFloat(consumed.toFixed(4));
  }

  // ── getSummary ─────────────────────────────────────────────
  async getSummary(
    shipId: string,
    year:   number
  ): Promise<BankingSummary> {
    const entries = await this.findByShipAndYear(shipId, year);

    const totalBanked    = entries.reduce((s, e) => s + e.amountGco2eq, 0);
    const totalRemaining = entries.reduce((s, e) => s + e.remaining, 0);

    return {
      shipId,
      year,
      totalBanked:    parseFloat(totalBanked.toFixed(4)),
      totalRemaining: parseFloat(totalRemaining.toFixed(4)),
      entries,
    };
  }
}