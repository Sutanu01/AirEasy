import { Logger } from '../config/index.js';

interface ConfirmationPayload {
  bookingId: number;
  pnr: string;
  flightId: number;
  userId: number;
  totalCost: number;
  noOfSeats: number;
}

export async function sendBookingConfirmation(payload: ConfirmationPayload) {
  // Simulate sending a transactional email
  Logger.info(`📧 EMAIL DISPATCH SUCCESSFUL: To User: ${payload.userId} | PNR: ${payload.pnr} | Booking: ${payload.bookingId} | Flight: ${payload.flightId} | Seats: ${payload.noOfSeats} | Cost: INR ${payload.totalCost}`);
}
