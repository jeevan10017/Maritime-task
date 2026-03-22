import 'dotenv/config';
import { createApp } from './infrastructure/server/app';
import { checkDbConnection } from './infrastructure/db/client';

const PORT = parseInt(process.env.PORT ?? '3001', 10);

async function bootstrap(): Promise<void> {
  await checkDbConnection();

  const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`
Backend server is running
Port: ${PORT}
Environment: ${process.env.NODE_ENV || 'development'}
Health check: http://localhost:${PORT}/api/health
  `);
});

  process.on('SIGTERM', () => {
    console.log('[Server] SIGTERM — shutting down gracefully');
    server.close(() => process.exit(0));
  });

  process.on('SIGINT', () => {
    console.log('[Server] SIGINT — shutting down gracefully');
    server.close(() => process.exit(0));
  });
}

bootstrap().catch((err) => {
  console.error('[Bootstrap] Fatal error:', err);
  process.exit(1);
});