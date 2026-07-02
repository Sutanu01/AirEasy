import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ServerConfig, Logger } from './config/index.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

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
