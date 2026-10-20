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
    const { bookingId, razorpayPaymentId, razorpaySignature } = req.body;
    const idempotencyKey = req.headers['x-idempotency-key'];
    const userEmail = req.headers['x-user-email'] as string | undefined;

    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
      throw new AppError('Idempotency key header is required', StatusCodes.BAD_REQUEST);
    }

    const result = await BookingService.makePayment({
      bookingId: Number(bookingId),
      idempotencyKey,
      recipientEmail: userEmail,
      razorpayPaymentId,
      razorpaySignature,
    });

    return res
      .status(result.status)
      .json(SuccessResponse(result.data.message, result.data.booking));
  } catch (error) {
    next(error);
  }
}

async function createPaymentOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { bookingId } = req.body;
    const userIdHeader = req.headers['x-user-id'];
    const userId = userIdHeader ? Number(userIdHeader) : (req.body.userId ? Number(req.body.userId) : undefined);

    const result = await BookingService.createPaymentOrder(Number(bookingId), userId);

    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse('Successfully created Razorpay payment order', result));
  } catch (error) {
    next(error);
  }
}

async function getUserBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const userIdHeader = req.headers['x-user-id'];
    const userId = userIdHeader ? Number(userIdHeader) : (req.query.userId ? Number(req.query.userId) : undefined);

    if (!userId || Number.isNaN(userId)) {
      throw new AppError('User authentication required to fetch bookings', StatusCodes.UNAUTHORIZED);
    }

    const bookings = await BookingService.getUserBookings(userId);

    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse('Successfully fetched user bookings', bookings));
  } catch (error) {
    next(error);
  }
}

async function getBookingById(req: Request, res: Response, next: NextFunction) {
  try {
    const bookingId = Number(req.params.id);
    const userIdHeader = req.headers['x-user-id'];
    const userId = userIdHeader ? Number(userIdHeader) : undefined;

    if (Number.isNaN(bookingId)) {
      throw new AppError('Invalid booking ID provided', StatusCodes.BAD_REQUEST);
    }

    const booking = await BookingService.getBookingById(bookingId, userId);

    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse('Successfully fetched booking details', booking));
  } catch (error) {
    next(error);
  }
}

async function cancelBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const bookingId = Number(req.params.id);
    const userIdHeader = req.headers['x-user-id'];
    const userId = userIdHeader ? Number(userIdHeader) : undefined;

    if (Number.isNaN(bookingId)) {
      throw new AppError('Invalid booking ID provided', StatusCodes.BAD_REQUEST);
    }

    const booking = await BookingService.cancelBooking(bookingId, userId);

    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse('Successfully cancelled the booking', booking));
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
  createPaymentOrder,
  makePayment,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getFlightSeatsMap,
};
