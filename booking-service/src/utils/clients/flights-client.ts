import axios from 'axios';
import { AppError } from '../errors/app-error.js';
import { StatusCodes } from 'http-status-codes';
import ServerConfig from '../../config/server-config.js';

export class FlightsClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = ServerConfig.FLIGHTS_SERVICE_URL;
  }

  async getFlight(flightId: number) {
    try {
      const response = await axios.get(`${this.baseUrl}/flights/${flightId}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        throw new AppError(
          error.response.data.message || 'Failed to fetch flight data',
          error.response.status,
          error.response.data.error?.explanation
        );
      }
      throw new AppError('Flights service is currently unreachable', StatusCodes.SERVICE_UNAVAILABLE);
    }
  }

  async updateSeats(flightId: number, seats: number, dec: boolean = true) {
    try {
      const response = await axios.patch(`${this.baseUrl}/flights/${flightId}/seats`, {
        seats,
        dec,
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        throw new AppError(
          error.response.data.message || 'Failed to update seats',
          error.response.status,
          error.response.data.error?.explanation
        );
      }
      throw new AppError('Flights service is currently unreachable', StatusCodes.SERVICE_UNAVAILABLE);
    }
  }
}

export const flightsClient = new FlightsClient();
