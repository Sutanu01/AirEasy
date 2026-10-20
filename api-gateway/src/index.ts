import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ServerConfig, Logger } from './config/index.js';
import apiRoutes from './routes/index.js';
import { errorHandler, globalRateLimiter } from './middlewares/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-idempotency-key', 'x-user-id', 'x-user-email'],
}));
app.use(cookieParser());
app.use(globalRateLimiter);

app.use('/api', apiRoutes);
app.use(errorHandler);

const startServer = async () => {
  try {
    app.listen(ServerConfig.SERVER_PORT, () => {
      Logger.info(`[API Gateway] Server started listening at http://localhost:${ServerConfig.SERVER_PORT}/api`);
    });
  } catch (error: any) {
    Logger.error(`[API Gateway] Startup error: ${error.message}`);
    process.exit(1);
  }
};

void startServer();
