import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as FlightService from './services/flight-service.js';
import ServerConfig from './config/server-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let PROTO_PATH = path.join(__dirname, 'protos', 'flights.proto');
if (!fs.existsSync(PROTO_PATH)) {
  PROTO_PATH = path.join(__dirname, '..', 'src', 'protos', 'flights.proto');
}


const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const flightProto: any = grpc.loadPackageDefinition(packageDefinition).flight;

async function getFlight(call: any, callback: any) {
  try {
    const flightId = call.request.id;
    const flight = await FlightService.getFlight(flightId);
    
    callback(null, {
      id: flight.id,
      flightNumber: flight.flightNumber,
      airplaneId: flight.airplaneId,
      departureTime: flight.departureTime.toISOString(),
      arrivalTime: flight.arrivalTime.toISOString(),
      departureAirportId: flight.departureAirportId,
      arrivalAirportId: flight.arrivalAirportId,
      price: flight.price,
      boardingGate: flight.boardingGate || '',
      availableSeats: flight.availableSeats,
    });
  } catch (error: any) {
    console.error('gRPC getFlight Error:', error);
    callback({
      code: grpc.status.NOT_FOUND,
      message: error.message || 'Flight not found',
    });
  }
}

async function updateSeats(call: any, callback: any) {
  try {
    const { flightId, seats, dec } = call.request;
    const flight = await FlightService.updateSeats(flightId, seats, dec);
    
    callback(null, {
      id: flight.id,
      flightNumber: flight.flightNumber,
      airplaneId: flight.airplaneId,
      departureTime: flight.departureTime.toISOString(),
      arrivalTime: flight.arrivalTime.toISOString(),
      departureAirportId: flight.departureAirportId,
      arrivalAirportId: flight.arrivalAirportId,
      price: flight.price,
      boardingGate: flight.boardingGate || '',
      availableSeats: flight.availableSeats,
    });
  } catch (error: any) {
    console.error('gRPC updateSeats Error:', error);
    callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: error.message || 'Failed to update seats',
    });
  }
}

async function getFlightSeats(call: any, callback: any) {
  try {
    const flightId = call.request.id;
    const seats = await FlightService.getFlightSeats(flightId);
    
    const formattedSeats = seats.map((seat: any) => ({
      id: seat.id,
      airplaneId: seat.airplaneId,
      row: seat.row,
      column: seat.column,
      seatType: seat.seatType.toLowerCase(),
    }));

    callback(null, { seats: formattedSeats });
  } catch (error: any) {
    console.error('gRPC getFlightSeats Error:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: error.message || 'Failed to get flight seats',
    });
  }
}

export function startGrpcServer() {
  const server = new grpc.Server();
  
  server.addService(flightProto.FlightService.service, {
    getFlight,
    updateSeats,
    getFlightSeats,
  });

  const port = `0.0.0.0:${ServerConfig.GRPC_PORT}`;
  server.bindAsync(port, grpc.ServerCredentials.createInsecure(), (err, portNumber) => {
    if (err) {
      console.error('Failed to bind gRPC server:', err);
      return;
    }
    console.log(`gRPC Server started successfully at ${port}`);
  });
}
