import { Router, Request, Response, NextFunction } from 'express';
import pool from '../../../infrastructure/db/client';
import { PostgresBankingRepository }    from '../../outbound/postgres/PostgresBankingRepository';
import { PostgresComplianceRepository } from '../../outbound/postgres/PostgresComplianceRepository';
import { GetBankingRecords } from '../../../core/application/usecases/GetBankingRecords';
import { BankSurplus }       from '../../../core/application/usecases/BankSurplus';
import { ApplyBanked }       from '../../../core/application/usecases/ApplyBanked';
import { DomainError }       from '../../../core/application/usecases/SetBaseline';

export const bankingRouter = Router();

// ── DI wiring ────────────────────────────────────────────────
const bankingRepo    = new PostgresBankingRepository(pool);
const complianceRepo = new PostgresComplianceRepository(pool);

const getBankingRecords = new GetBankingRecords(bankingRepo);
const bankSurplus       = new BankSurplus(bankingRepo, complianceRepo);
const applyBanked       = new ApplyBanked(bankingRepo, complianceRepo);

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
// GET /banking/records?shipId=R002&year=2024
// ────────────────────────────────────────────────────────────
bankingRouter.get(
  '/records',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shipId, year: yearStr } = req.query;

      if (!shipId || typeof shipId !== 'string') {
        res.status(400).json({
          status:  'error',
          message: 'Query param "shipId" is required',
        });
        return;
      }

      const year = parseInt(yearStr as string, 10);
      if (!yearStr || isNaN(year)) {
        res.status(400).json({
          status:  'error',
          message: 'Query param "year" must be a valid integer',
        });
        return;
      }

      const summary = await getBankingRecords.execute({ shipId, year });

      res.status(200).json({ status: 'ok', data: summary });
    } catch (err) {
      handleError(err, res, next);
    }
  }
);

// ────────────────────────────────────────────────────────────
// POST /banking/bank
// Body: { shipId, year, amount }
// ────────────────────────────────────────────────────────────
bankingRouter.post(
  '/bank',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shipId, year, amount } = req.body;

      // ── Validation ────────────────────────────────────────
      if (!shipId || typeof shipId !== 'string') {
        res.status(400).json({
          status: 'error', message: '"shipId" is required',
        });
        return;
      }

      const parsedYear   = parseInt(String(year), 10);
      const parsedAmount = parseFloat(String(amount));

      if (isNaN(parsedYear)) {
        res.status(400).json({
          status: 'error', message: '"year" must be a valid integer',
        });
        return;
      }
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        res.status(400).json({
          status: 'error', message: '"amount" must be a positive number',
        });
        return;
      }

      const entry = await bankSurplus.execute({
        shipId,
        year:   parsedYear,
        amount: parsedAmount,
      });

      res.status(201).json({
        status:  'ok',
        message: `Successfully banked ${parsedAmount} gCO₂e for ship ${shipId}`,
        data:    entry,
      });
    } catch (err) {
      handleError(err, res, next);
    }
  }
);

// ────────────────────────────────────────────────────────────
// POST /banking/apply
// Body: { shipId, year, amount }
// ────────────────────────────────────────────────────────────
bankingRouter.post(
  '/apply',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shipId, year, amount } = req.body;

      // ── Validation ────────────────────────────────────────
      if (!shipId || typeof shipId !== 'string') {
        res.status(400).json({
          status: 'error', message: '"shipId" is required',
        });
        return;
      }

      const parsedYear   = parseInt(String(year), 10);
      const parsedAmount = parseFloat(String(amount));

      if (isNaN(parsedYear)) {
        res.status(400).json({
          status: 'error', message: '"year" must be a valid integer',
        });
        return;
      }
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        res.status(400).json({
          status: 'error', message: '"amount" must be a positive number',
        });
        return;
      }

      const result = await applyBanked.execute({
        shipId,
        year:   parsedYear,
        amount: parsedAmount,
      });

      res.status(200).json({
        status:  'ok',
        message: `Applied ${result.applied} gCO₂e banked surplus to ship ${shipId}`,
        data: {
          shipId:          result.shipId,
          year:            result.year,
          cbBefore:        result.cbBefore,
          applied:         result.applied,
          cbAfter:         result.cbAfter,
          remainingInBank: result.remainingInBank,
        },
      });
    } catch (err) {
      handleError(err, res, next);
    }
  }
);