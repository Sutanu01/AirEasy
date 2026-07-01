import dotenv from 'dotenv';

dotenv.config();

const rawPort = process.env.SERVER_PORT;
const parsedPort = rawPort ? Number.parseInt(rawPort, 10) : NaN;

const rawHoldTtl = process.env.BOOKING_HOLD_TTL_MS;
const parsedHoldTtl = rawHoldTtl ? Number.parseInt(rawHoldTtl, 10) : NaN;

const ServerConfig = {
  SERVER_PORT: Number.isNaN(parsedPort) ? 4000 : parsedPort,
  FLIGHTS_SERVICE_URL: process.env.FLIGHTS_SERVICE_URL || 'http://localhost:3000/api/v1',
  FLIGHTS_GRPC_URL: process.env.FLIGHTS_GRPC_URL || 'localhost:50051',
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost',
  BOOKING_HOLD_TTL_MS: Number.isNaN(parsedHoldTtl) ? 1200000 : parsedHoldTtl,
};

export default ServerConfig;
