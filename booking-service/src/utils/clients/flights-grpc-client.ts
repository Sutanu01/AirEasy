import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { AppError } from '../errors/app-error.js';
import { StatusCodes } from 'http-status-codes';
import { ServerConfig } from '../../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to protobuf schema relative to compiled js output
let PROTO_PATH = path.join(__dirname, '..', '..', 'protos', 'flights.proto');
if (!fs.existsSync(PROTO_PATH)) {
  PROTO_PATH = path.join(__dirname, '..', '..', '..', 'src', 'protos', 'flights.proto');
}


const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const flightProto: any = grpc.loadPackageDefinition(packageDefinition).flight;

// TODO (Production): Replace createInsecure() with secure SSL/TLS credentials (e.g., grpc.credentials.createSsl())
// and migrate from dynamic protoLoader to statically generated code templates (ts-proto) for type safety.
const client = new flightProto.FlightService(
  ServerConfig.FLIGHTS_GRPC_URL,
  grpc.credentials.createInsecure()
);

export class FlightsGrpcClient {
  getFlight(flightId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      client.getFlight({ id: flightId }, (error: any, response: any) => {
        if (error) {
          return reject(
            new AppError(
              error.details || 'Failed to fetch flight details via gRPC',
              error.code === grpc.status.NOT_FOUND ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR
            )
          );
        }
        resolve(response);
      });
    });
  }

  updateSeats(flightId: number, seats: number, dec: boolean = true): Promise<any> {
    return new Promise((resolve, reject) => {
      client.updateSeats({ flightId, seats, dec }, (error: any, response: any) => {
        if (error) {
          return reject(
            new AppError(
              error.details || 'Failed to update seats via gRPC',
              error.code === grpc.status.INVALID_ARGUMENT ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR
            )
          );
        }
        resolve(response);
      });
    });
  }

  getFlightSeats(flightId: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      client.getFlightSeats({ id: flightId }, (error: any, response: any) => {
        if (error) {
          return reject(
            new AppError(
              error.details || 'Failed to fetch flight physical seats via gRPC',
              StatusCodes.INTERNAL_SERVER_ERROR
            )
          );
        }
        resolve(response.seats || []);
      });
    });
  }
}

export const flightsGrpcClient = new FlightsGrpcClient();
