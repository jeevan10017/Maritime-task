import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { healthRouter } from '../../adapters/inbound/http/healthRouter';
import { routeRouter }  from '../../adapters/inbound/http/routeRouter';

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const prefix = process.env.API_PREFIX ?? '/api/v1';

  app.use(`${prefix}/health`, healthRouter);
  app.use(`${prefix}/routes`, routeRouter);  

  
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ status: 'error', message: 'Route not found' });
  });

  // ── Global error handler ────────────────────────────────────
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Error]', err.message);
    res.status(500).json({
      status: 'error',
      message:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : err.message,
    });
  });

  return app;
}