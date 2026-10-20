import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/errors/app-error.js';
import { z } from 'zod';

const createBookingSchema = z.object({
  flightId: z
    .number()
    .int('flightId must be an integer')
    .positive('flightId must be positive'),
  userId: z
    .number()
    .int('userId must be an integer')
    .positive('userId must be positive'),
  noOfSeats: z
    .number()
    .int('noOfSeats must be an integer')
    .positive('noOfSeats must be at least 1'),
  seatIds: z
    .array(
      z
        .number()
        .int()
        .positive('seatId must be a positive integer')
    )
    .nonempty('At least one seatId must be selected'),
});

const paymentSchema = z.object({
  bookingId: z
    .number()
    .int('bookingId must be an integer')
    .positive('bookingId must be positive'),
  razorpayPaymentId: z.string().optional(),
  razorpaySignature: z.string().optional(),
});

const createOrderSchema = z.object({
  bookingId: z
    .number()
    .int('bookingId must be an integer')
    .positive('bookingId must be positive'),
});

function validateCreateRequest(req: Request, res: Response, next: NextFunction) {
  const data = {
    flightId: req.body.flightId !== undefined ? Number(req.body.flightId) : undefined,
    userId: req.body.userId !== undefined ? Number(req.body.userId) : undefined,
    noOfSeats: req.body.noOfSeats !== undefined ? Number(req.body.noOfSeats) : undefined,
    seatIds: req.body.seatIds ? req.body.seatIds.map(Number) : undefined,
  };

  const validation = createBookingSchema.safeParse(data);

  if (!validation.success) {
    const explanations = validation.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    throw new AppError('Invalid booking request data', StatusCodes.BAD_REQUEST, explanations);
  }

  req.body.flightId = data.flightId;
  req.body.userId = data.userId;
  req.body.noOfSeats = data.noOfSeats;
  req.body.seatIds = data.seatIds;

  next();
}

function validateCreateOrderRequest(req: Request, res: Response, next: NextFunction) {
  const data = {
    bookingId: req.body.bookingId !== undefined ? Number(req.body.bookingId) : undefined,
  };

  const validation = createOrderSchema.safeParse(data);

  if (!validation.success) {
    const explanations = validation.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    throw new AppError('Invalid create order request data', StatusCodes.BAD_REQUEST, explanations);
  }

  req.body.bookingId = data.bookingId;

  next();
}

function validatePaymentRequest(req: Request, res: Response, next: NextFunction) {

  const idempotencyKey = req.headers['x-idempotency-key'];

  if (!idempotencyKey || typeof idempotencyKey !== 'string') {
    throw new AppError('Idempotency key (x-idempotency-key) header is required for processing payments', StatusCodes.BAD_REQUEST);
  }

  const data = {
    bookingId: req.body.bookingId !== undefined ? Number(req.body.bookingId) : undefined,
    razorpayPaymentId: req.body.razorpayPaymentId,
    razorpaySignature: req.body.razorpaySignature,
  };

  const validation = paymentSchema.safeParse(data);

  if (!validation.success) {
    const explanations = validation.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    throw new AppError('Invalid payment request data', StatusCodes.BAD_REQUEST, explanations);
  }

  req.body.bookingId = data.bookingId;
  req.body.razorpayPaymentId = data.razorpayPaymentId;
  req.body.razorpaySignature = data.razorpaySignature;
  
  next();
}

export {
  validateCreateRequest,
  validateCreateOrderRequest,
  validatePaymentRequest,
};
