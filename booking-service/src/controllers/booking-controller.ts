import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as BookingService from '../services/booking-service.js';
import { SuccessResponse } from '../utils/common/index.js';
import { AppError } from '../utils/errors/app-error.js';

async function createBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const { flightId, userId, noOfSeats, seatIds } = req.body;

    const booking = await BookingService.createBooking({
      flightId: Number(flightId),
      userId: Number(userId),
      noOfSeats: Number(noOfSeats),
      seatIds: seatIds ? seatIds.map(Number) : [],
    });

    return res
      .status(StatusCodes.CREATED)
      .json(SuccessResponse('Successfully created the booking', booking));
  } catch (error) {
    next(error);
  }
}

async function makePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { bookingId } = req.body;
    const idempotencyKey = req.headers['x-idempotency-key'];
    const userEmail = req.headers['x-user-email'] as string | undefined;

    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
      throw new AppError('Idempotency key header is required', StatusCodes.BAD_REQUEST);
    }

    const result = await BookingService.makePayment(Number(bookingId), idempotencyKey, userEmail);

    return res
      .status(result.status)
      .json(SuccessResponse(result.data.message, result.data.booking));
  } catch (error) {
    next(error);
  }
}

async function getFlightSeatsMap(req: Request, res: Response, next: NextFunction) {
  try {
    const flightId = Number(req.params.flightId);
    if (Number.isNaN(flightId)) {
      throw new AppError('Invalid flight ID provided', StatusCodes.BAD_REQUEST);
    }
    const seatsMap = await BookingService.getFlightSeatsMap(flightId);

    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse('Successfully fetched flight seats status map', seatsMap));
  } catch (error) {
    next(error);
  }
}

export {
  createBooking,
  makePayment,
  getFlightSeatsMap,
};
