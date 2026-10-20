import crypto from 'crypto';
import BookingRepository from "../repositories/booking-repository.js";
import { Booking, BookingStatus, Prisma } from "@prisma/client";
import { AppError } from "../utils/errors/app-error.js";
import { StatusCodes } from "http-status-codes";
import { flightsGrpcClient } from "../utils/clients/flights-grpc-client.js";
import { prisma, razorpay, ServerConfig } from "../config/index.js";
import { channel, HOLD_TTL_QUEUE_NAME, NOTIFICATION_QUEUE_NAME } from "../config/queue.js";
import { generateRandomPNR } from "../utils/helpers/pnr-generator.js";

const bookingRepository = new BookingRepository();

interface CreateBookingInput {
  flightId: number;
  userId: number;
  noOfSeats: number;
  seatIds: number[];
}

interface PaymentInput {
  bookingId: number;
  idempotencyKey: string;
  recipientEmail?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

async function createBooking(data: CreateBookingInput): Promise<Booking> {
  const { flightId, userId, noOfSeats, seatIds } = data;

  if (seatIds.length !== noOfSeats) {
    throw new AppError("The number of seat IDs must match the number of seats requested", StatusCodes.BAD_REQUEST);
  }

  const flight = await flightsGrpcClient.getFlight(flightId);

  if (flight.availableSeats < noOfSeats) {
    throw new AppError("Not enough seats available to complete booking", StatusCodes.BAD_REQUEST);
  }

  const totalCost = flight.price * noOfSeats;

  const alreadyTakenSeat = await prisma.bookingSeat.findFirst({
    where: {
      seatId: { in: seatIds },
      booking: {
        flightId,
        status: { in: [BookingStatus.PENDING, BookingStatus.BOOKED] }
      }
    }
  });

  if (alreadyTakenSeat) {
    throw new AppError("One or more of the selected seats are already locked or booked", StatusCodes.BAD_REQUEST);
  }

  let pnr = "";
  let isUnique = false;
  while (!isUnique) {
    pnr = generateRandomPNR();
    const existing = await prisma.booking.findUnique({
      where: { pnr }
    });
    if (!existing) {
      isUnique = true;
    }
  }

  const booking = await prisma.$transaction(async (tx) => {
    const newBooking = await tx.booking.create({
      data: {
        pnr,
        flightId,
        userId,
        noOfSeats,
        totalCost,
        status: BookingStatus.PENDING
      }
    });

    await tx.bookingSeat.createMany({
      data: seatIds.map((seatId) => ({
        bookingId: newBooking.id,
        seatId
      }))
    });

    return newBooking;
  });

  try {
    await flightsGrpcClient.updateSeats(flightId, noOfSeats, true);

    const holdMessage = JSON.stringify({ bookingId: booking.id });
    channel.sendToQueue(HOLD_TTL_QUEUE_NAME, Buffer.from(holdMessage), { persistent: true });

    return booking;

  } catch (error: any) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.CANCELLED }
    });

    throw new AppError(
      error.message || "Failed to finalize seat hold",
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function createPaymentOrder(bookingId: number, userId?: number): Promise<{
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  booking: Booking;
}> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });

  if (!booking) {
    throw new AppError("The booking does not exist", StatusCodes.NOT_FOUND);
  }

  if (userId && booking.userId !== userId) {
    throw new AppError("Unauthorized access to this booking", StatusCodes.FORBIDDEN);
  }

  if (booking.status === BookingStatus.CANCELLED) {
    throw new AppError("Cannot pay for a cancelled booking", StatusCodes.BAD_REQUEST);
  }

  if (booking.status === BookingStatus.BOOKED) {
    throw new AppError("Booking is already paid and confirmed", StatusCodes.BAD_REQUEST);
  }

  if (booking.razorpayOrderId) {
    return {
      orderId: booking.razorpayOrderId,
      amount: booking.totalCost * 100,
      currency: 'INR',
      keyId: ServerConfig.RAZORPAY_KEY_ID,
      booking
    };
  }

  const order = await razorpay.orders.create({
    amount: booking.totalCost * 100,
    currency: 'INR',
    receipt: `rcpt_${booking.pnr}_${booking.id}`.slice(0, 40),
    notes: {
      bookingId: String(booking.id),
      pnr: booking.pnr,
      flightId: String(booking.flightId),
    }
  });

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      razorpayOrderId: order.id
    }
  });

  return {
    orderId: order.id,
    amount: Number(order.amount),
    currency: order.currency,
    keyId: ServerConfig.RAZORPAY_KEY_ID,
    booking: updatedBooking
  };
}

async function makePayment(input: PaymentInput): Promise<any> {
  const { bookingId, idempotencyKey, recipientEmail, razorpayPaymentId, razorpaySignature } = input;

  const existingKey = await prisma.idempotencyKey.findUnique({
    where: { key: idempotencyKey }
  });

  if (existingKey) {
    return {
      status: existingKey.responseStatus,
      data: JSON.parse(existingKey.responseBody),
      cached: true
    };
  }

  const booking = await bookingRepository.get(bookingId);
  if (!booking) {
    throw new AppError("The booking you requested to pay for does not exist", StatusCodes.NOT_FOUND);
  }

  if (booking.status === BookingStatus.CANCELLED) {
    throw new AppError("Cannot pay for a cancelled booking", StatusCodes.BAD_REQUEST);
  }

  if (booking.status === BookingStatus.BOOKED) {
    return {
      status: StatusCodes.OK,
      data: {
        message: "Booking is already confirmed",
        booking
      },
      cached: false
    };
  }

  // If Razorpay payment details are provided, verify the HMAC signature
  if (razorpayPaymentId && razorpaySignature) {
    if (!booking.razorpayOrderId) {
      throw new AppError("No Razorpay order found for this booking. Please initiate checkout first.", StatusCodes.BAD_REQUEST);
    }

    const expectedSignature = crypto
      .createHmac('sha256', ServerConfig.RAZORPAY_KEY_SECRET)
      .update(`${booking.razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      throw new AppError("Payment verification failed: Invalid Razorpay signature", StatusCodes.BAD_REQUEST);
    }
  }

  const updatedBooking = await prisma.$transaction(async (tx) => {
    return await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.BOOKED,
        ...(razorpayPaymentId ? { razorpayPaymentId } : {}),
        ...(razorpaySignature ? { razorpaySignature } : {})
      }
    });
  });

  const notificationPayload = JSON.stringify({
    bookingId: updatedBooking.id,
    pnr: updatedBooking.pnr,
    flightId: updatedBooking.flightId,
    userId: updatedBooking.userId,
    totalCost: updatedBooking.totalCost,
    noOfSeats: updatedBooking.noOfSeats,
    recipientEmail: recipientEmail || 'sutanuj11@gmail.com'
  });

  channel.sendToQueue(NOTIFICATION_QUEUE_NAME, Buffer.from(notificationPayload), { persistent: true });

  const responseData = {
    message: "Payment successfully processed, seats confirmed",
    booking: updatedBooking
  };

  await prisma.idempotencyKey.create({
    data: {
      key: idempotencyKey,
      responseStatus: StatusCodes.OK,
      responseBody: JSON.stringify(responseData)
    }
  });

  return {
    status: StatusCodes.OK,
    data: responseData,
    cached: false
  };
}

async function getUserBookings(userId: number): Promise<any[]> {
  return await prisma.booking.findMany({
    where: { userId },
    include: {
      bookingSeats: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async function getBookingById(bookingId: number, userId?: number): Promise<any> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      bookingSeats: true,
    },
  });

  if (!booking) {
    throw new AppError("The booking does not exist", StatusCodes.NOT_FOUND);
  }

  if (userId && booking.userId !== userId) {
    throw new AppError("Unauthorized access to this booking", StatusCodes.FORBIDDEN);
  }

  return booking;
}

async function cancelBooking(bookingId: number, userId?: number): Promise<any> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });

  if (!booking) {
    throw new AppError("The booking does not exist", StatusCodes.NOT_FOUND);
  }

  if (userId && booking.userId !== userId) {
    throw new AppError("Unauthorized to cancel this booking", StatusCodes.FORBIDDEN);
  }

  if (booking.status === BookingStatus.CANCELLED) {
    return booking;
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.CANCELLED }
  });

  try {
    await flightsGrpcClient.updateSeats(booking.flightId, booking.noOfSeats, false);
  } catch (error: any) {
    // continue if seat update fails
  }

  return updatedBooking;
}

async function getFlightSeatsMap(flightId: number): Promise<any[]> {
  const physicalSeats = await flightsGrpcClient.getFlightSeats(flightId);

  const activeBookingSeats = await prisma.bookingSeat.findMany({
    where: {
      booking: {
        flightId,
        status: { in: [BookingStatus.PENDING, BookingStatus.BOOKED] }
      }
    },
    select: { seatId: true }
  });

  const bookedSeatIds = new Set(activeBookingSeats.map((bs) => bs.seatId));

  return physicalSeats.map((seat: any) => ({
    id: seat.id,
    airplaneId: seat.airplaneId,
    row: seat.row,
    column: seat.column,
    seatType: seat.seatType,
    isBooked: bookedSeatIds.has(seat.id)
  }));
}

export {
  createBooking,
  createPaymentOrder,
  makePayment,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getFlightSeatsMap
};
