import dotenv from 'dotenv';

dotenv.config();

const rawPort = process.env.SERVER_PORT;
const parsedPort = rawPort ? Number.parseInt(rawPort, 10) : NaN;

const ServerConfig = {
  SERVER_PORT: Number.isNaN(parsedPort) ? 5000 : parsedPort,
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost',
};

export default ServerConfig;
