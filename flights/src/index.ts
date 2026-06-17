import express from 'express';

import { ServerConfig, prisma } from './config/index.js';
import apiRoutes from './routes/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);


const startServer = async () => {
  try {
    // Prisma uses a single client instance for the app, which keeps database access simple
    // and avoids opening multiple connection pools while the server is running.
    await prisma.$connect();
    console.log('Database connection established successfully with Prisma.');

    app.listen(ServerConfig.SERVER_PORT, () => {
      console.log(`Successfully started the server at http://localhost:${ServerConfig.SERVER_PORT}/api`);
    });
  } catch (error) {
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
};

void startServer();
