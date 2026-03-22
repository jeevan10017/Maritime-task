import { Router, Request, Response, NextFunction } from 'express';
import pool from '../../../infrastructure/db/client';
import { PostgresPoolRepository }       from '../../outbound/postgres/PostgresPoolRepository';
import { PostgresComplianceRepository } from '../../outbound/postgres/PostgresComplianceRepository';
import { PostgresBankingRepository }    from '../../outbound/postgres/PostgresBankingRepository';
import { CreatePool } from '../../../core/application/usecases/CreatePool';
import { DomainError } from '../../../core/application/usecases/SetBaseline';

export const poolRouter = Router();

const poolRepo       = new PostgresPoolRepository(pool);
const complianceRepo = new PostgresComplianceRepository(pool);
const bankingRepo    = new PostgresBankingRepository(pool);

const createPool = new CreatePool(poolRepo, complianceRepo, bankingRepo);

// ────────────────────────────────────────────────────────────
// POST /pools
// Body: { year, members: [{ shipId }] }
// ────────────────────────────────────────────────────────────
poolRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { year, members } = req.body;

      const parsedYear = parseInt(String(year), 10);
      if (!year || isNaN(parsedYear)) {
        res.status(400).json({
          status: 'error', message: '"year" must be a valid integer',
        });
        return;
      }

      if (!Array.isArray(members) || members.length < 2) {
        res.status(400).json({
          status: 'error',
          message: '"members" must be an array with at least 2 ships',
        });
        return;
      }

      for (const m of members) {
        if (!m.shipId || typeof m.shipId !== 'string') {
          res.status(400).json({
            status: 'error',
            message: 'Each member must have a valid "shipId" string',
          });
          return;
        }
      }

      const result = await createPool.execute({
        year:    parsedYear,
        members: members.map((m: { shipId: string }) => ({
          shipId:   m.shipId,
          cbBefore: 0, 
        })),
      });

      res.status(201).json({
        status:  'ok',
        message: `Pool created with ${result.members.length} members`,
        data: {
          poolId:    result.id,
          year:      result.year,
          poolSum:   result.poolSum,
          createdAt: result.createdAt,
          members:   result.members.map((m: { shipId: string; cbBefore: number; cbAfter: number }) => ({
            shipId:   m.shipId,
            cbBefore: m.cbBefore,
            cbAfter:  m.cbAfter,
            delta:    parseFloat((m.cbAfter - m.cbBefore).toFixed(4)),
          })),
        },
      });
    } catch (err) {
      if (err instanceof DomainError) {
        res.status(err.statusCode).json({
          status:  'error',
          message: err.message,
        });
        return;
      }
      next(err);
    }
  }
);