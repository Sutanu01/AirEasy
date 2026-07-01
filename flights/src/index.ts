import express from 'express';

import { ServerConfig, prisma } from './config/index.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/index.js';
import { startGrpcServer } from './grpc-server.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connection established successfully with Prisma.');

    startGrpcServer();

    app.listen(ServerConfig.SERVER_PORT, () => {
      console.log(`Successfully started the HTTP server at http://localhost:${ServerConfig.SERVER_PORT}/api`);
    });
  } catch (error) {
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
};


void startServer();
