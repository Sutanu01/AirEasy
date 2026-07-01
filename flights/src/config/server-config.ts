import dotenv from 'dotenv';

dotenv.config();

const rawPort = process.env.SERVER_PORT;
const parsedPort = rawPort ? Number.parseInt(rawPort, 10) : NaN;

const rawGrpcPort = process.env.GRPC_PORT;
const parsedGrpcPort = rawGrpcPort ? Number.parseInt(rawGrpcPort, 10) : NaN;

const ServerConfig = {
  SERVER_PORT: Number.isNaN(parsedPort) ? 3000 : parsedPort,
  GRPC_PORT: Number.isNaN(parsedGrpcPort) ? 50051 : parsedGrpcPort,
};

export default ServerConfig;
