import { Resend } from 'resend';
import { ServerConfig, Logger } from '../config/index.js';
import { getBookingConfirmationTemplate } from '../templates/booking-confirmation.js';

const resend = new Resend(ServerConfig.RESEND_API_KEY);

interface ConfirmationPayload {
  bookingId: number;
  pnr: string;
  flightId: number;
  userId: number;
  totalCost: number;
  noOfSeats: number;
  recipientEmail: string;
}

function validatePayload(payload: any): payload is ConfirmationPayload {
  return (
    payload &&
    typeof payload.bookingId === 'number' &&
    typeof payload.pnr === 'string' &&
    typeof payload.flightId === 'number' &&
    typeof payload.userId === 'number' &&
    typeof payload.totalCost === 'number' &&
    typeof payload.noOfSeats === 'number' &&
    typeof payload.recipientEmail === 'string'
  );
}

export async function sendBookingConfirmation(payload: ConfirmationPayload) {
  try {
    if (!validatePayload(payload)) {
      Logger.error(`[Notification Service] Invalid queue message structure received: ${JSON.stringify(payload)}`);
      return;
    }

    if (!ServerConfig.RESEND_API_KEY) {
      Logger.warn('[Notification Service] RESEND_API_KEY is not configured. Skipping email dispatch.');
      return;
    }

    const recipient = payload.recipientEmail;
    const sender = ServerConfig.SENDER_EMAIL;
    Logger.info(`[Notification Service] Dispatching ticket email dynamically to customer ${recipient} for PNR: ${payload.pnr}...`);

    
    const emailHtml = getBookingConfirmationTemplate(payload);

    const { data, error } = await resend.emails.send({
      from: sender,
      to: recipient,
      subject: `Booking Confirmation [PNR: ${payload.pnr}]`,
      html: emailHtml,
    });

    if (error) {
      Logger.error(`[Notification Service] Resend SDK returned dispatch error: ${error.message}`);
      throw error;
    }

    Logger.info(`[Notification Service] Resend email successfully dispatched! Message ID: ${data?.id}`);
  } catch (error: any) {
    Logger.error(`[Notification Service] Failed to execute email confirmation flow: ${error.message}`);
    throw error;
  }
}
