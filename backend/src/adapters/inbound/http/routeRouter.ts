import { Router, Request, Response, NextFunction } from 'express';
import pool from '../../../infrastructure/db/client';
import { PostgresRouteRepository } from '../../outbound/postgres/PostgresRouteRepository';
import { GetRoutes }    from '../../../core/application/usecases/GetRoutes';
import { SetBaseline, DomainError } from '../../../core/application/usecases/SetBaseline';
import { GetComparison } from '../../../core/application/usecases/GetComparison';
import { RouteFilters, VesselType, FuelType } from '../../../core/domain/route';

export const routeRouter = Router();


const routeRepo    = new PostgresRouteRepository(pool);
const getRoutes    = new GetRoutes(routeRepo);
const setBaseline  = new SetBaseline(routeRepo);
const getComparison = new GetComparison(routeRepo);

// ────────────────────────────────────────────────────────────
// GET /routes
// ────────────────────────────────────────────────────────────
routeRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters: RouteFilters = {};

      if (req.query.vesselType) {
        filters.vesselType = req.query.vesselType as VesselType;
      }
      if (req.query.fuelType) {
        filters.fuelType = req.query.fuelType as FuelType;
      }
      if (req.query.year) {
        const year = parseInt(req.query.year as string, 10);
        if (isNaN(year)) {
          res.status(400).json({
            status: 'error',
            message: 'year must be a valid integer',
          });
          return;
        }
        filters.year = year;
      }

      const routes = await getRoutes.execute(filters);
      res.status(200).json({ status: 'ok', count: routes.length, data: routes });
    } catch (err) {
      next(err);
    }
  }
);

// ────────────────────────────────────────────────────────────
// GET /routes/comparison 
// ────────────────────────────────────────────────────────────
routeRouter.get(
  '/comparison',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const comparisons = await getComparison.execute();

      res.status(200).json({
        status: 'ok',
        target: 89.3368,
        count:  comparisons.length,
        data:   comparisons,
      });
    } catch (err) {
      if (err instanceof DomainError) {
        res.status(err.statusCode).json({
          status: 'error',
          message: err.message,
        });
        return;
      }
      next(err);
    }
  }
);

// ────────────────────────────────────────────────────────────
// POST /routes/:id/baseline
// ────────────────────────────────────────────────────────────
routeRouter.post(
  '/:id/baseline',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id) || id <= 0) {
        res.status(400).json({
          status: 'error',
          message: 'Route id must be a positive integer',
        });
        return;
      }

      const updated = await setBaseline.execute(id);
      res.status(200).json({
        status: 'ok',
        message: `Route ${updated.routeId} is now the baseline`,
        data: updated,
      });
    } catch (err) {
      if (err instanceof DomainError) {
        res.status(err.statusCode).json({
          status: 'error',
          message: err.message,
        });
        return;
      }
      next(err);
    }
  }
);