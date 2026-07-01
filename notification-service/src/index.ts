import express from 'express';
import cors from 'cors';
import { ServerConfig, Logger, initializeQueue } from './config/index.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/index.js';
import { startNotificationQueueConsumer } from './utils/queue/notification-consumer.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', apiRoutes);
app.use(errorHandler);

async function startNotificationService() {
  try {

    await initializeQueue();
    await startNotificationQueueConsumer();

    app.listen(ServerConfig.SERVER_PORT, () => {
      Logger.info(`[Notification Service] HTTP server listening at http://localhost:${ServerConfig.SERVER_PORT}/api`);
    });

  } catch (error: any) {
    Logger.error(`[Notification Service] Fatal startup error: ${error.message}`);
    process.exit(1);
  }
}

void startNotificationService();
