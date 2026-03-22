import 'dotenv/config';
import { createApp } from './infrastructure/server/app';

const PORT = parseInt(process.env.PORT ?? '3001', 10);

const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`
Backend server is running
Port: ${PORT}
Environment: ${process.env.NODE_ENV || 'development'}
Health check: http://localhost:${PORT}/api/health
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received -shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[Server] SIGINT received - shutting down gracefully');
  server.close(() => process.exit(0));
});