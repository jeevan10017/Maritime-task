import { Router, Request, Response, NextFunction } from 'express';
import pool from '../../../infrastructure/db/client';
import { PostgresRouteRepository }      from '../../outbound/postgres/PostgresRouteRepository';
import { PostgresComplianceRepository } from '../../outbound/postgres/PostgresComplianceRepository';
import { PostgresBankingRepository }    from '../../outbound/postgres/PostgresBankingRepository';
import { ComputeCB }      from '../../../core/application/usecases/ComputeCB';
import { GetAdjustedCB }  from '../../../core/application/usecases/GetAdjustedCB';
import { DomainError }    from '../../../core/application/usecases/SetBaseline';

export const complianceRouter = Router();

const routeRepo      = new PostgresRouteRepository(pool);
const complianceRepo = new PostgresComplianceRepository(pool);
const bankingRepo    = new PostgresBankingRepository(pool);

const computeCB     = new ComputeCB(routeRepo, complianceRepo);
const getAdjustedCB = new GetAdjustedCB(complianceRepo, bankingRepo);

// ── Shared error handler ─────────────────────────────────────
function handleError(
  err: unknown,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof DomainError) {
    res.status(err.statusCode).json({
      status:  'error',
      message: err.message,
    });
    return;
  }
  next(err);
}

// ────────────────────────────────────────────────────────────
// GET /compliance/cb?shipId=&year=
// ────────────────────────────────────────────────────────────
complianceRouter.get(
  '/cb',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shipId, year: yearStr } = req.query;

      if (!shipId || typeof shipId !== 'string') {
        res.status(400).json({
          status: 'error', message: 'Query param "shipId" is required',
        });
        return;
      }

      const year = parseInt(yearStr as string, 10);
      if (!yearStr || isNaN(year)) {
        res.status(400).json({
          status: 'error', message: 'Query param "year" must be a valid integer',
        });
        return;
      }

      const cb = await computeCB.execute({ shipId, year });

      res.status(200).json({
        status: 'ok',
        data: {
          shipId:          cb.shipId,
          year:            cb.year,
          targetIntensity: cb.targetIntensity,
          actualIntensity: cb.actualIntensity,
          energyInScope:   cb.energyInScope,
          cbGco2eq:        cb.cbGco2eq,
          cbStatus:        cb.status,
          computedAt:      cb.computedAt,
        },
      });
    } catch (err) {
      handleError(err, res, next);
    }
  }
);

// ────────────────────────────────────────────────────────────
// GET /compliance/adjusted-cb?shipId=&year=
// ────────────────────────────────────────────────────────────
complianceRouter.get(
  '/adjusted-cb',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shipId, year: yearStr } = req.query;

      if (!shipId || typeof shipId !== 'string') {
        res.status(400).json({
          status: 'error', message: 'Query param "shipId" is required',
        });
        return;
      }

      const year = parseInt(yearStr as string, 10);
      if (!yearStr || isNaN(year)) {
        res.status(400).json({
          status: 'error', message: 'Query param "year" must be a valid integer',
        });
        return;
      }

      const result = await getAdjustedCB.execute({ shipId, year });

      res.status(200).json({ status: 'ok', data: result });
    } catch (err) {
      handleError(err, res, next);
    }
  }
);