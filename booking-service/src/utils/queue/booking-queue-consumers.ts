import { channel, RELEASE_QUEUE_NAME } from '../../config/queue.js';
import { prisma, Logger } from '../../config/index.js';
import { BookingStatus } from '@prisma/client';
import { flightsGrpcClient } from '../clients/flights-grpc-client.js';

export async function startBookingQueueConsumers() {
  try {
    await channel.prefetch(10);

    Logger.info(`[Queue Consumer] Listening for expired holds on queue "${RELEASE_QUEUE_NAME}"...`);

    await channel.consume(RELEASE_QUEUE_NAME, async (msg: any) => {
      if (!msg) return;

      let bookingId: number | undefined;
      try {
        const payload = JSON.parse(msg.content.toString());
        bookingId = payload.bookingId;

        if (!bookingId) {
          Logger.error('[Queue Consumer] Message received without a valid bookingId');
          channel.ack(msg);
          return;
        }

        const booking = await prisma.booking.findUnique({
          where: { id: bookingId }
        });

        if (!booking) {
          Logger.warn(`[Queue Consumer] Booking ID ${bookingId} not found in database.`);
          channel.ack(msg);
          return;
        }

        if (booking.status === BookingStatus.PENDING) {
          await flightsGrpcClient.updateSeats(booking.flightId, booking.noOfSeats, false);

          await prisma.booking.update({
            where: { id: bookingId },
            data: { status: BookingStatus.CANCELLED }
          });

          Logger.info(`[Queue Consumer] Successfully cancelled booking ID ${bookingId} and released ${booking.noOfSeats} seats.`);
        }

        channel.ack(msg);

      } catch (error: any) {
        Logger.error(`[Queue Consumer] Error processing hold release message for booking ID ${bookingId || 'unknown'}: ${error.message}`);
        
        channel.nack(msg, false, true);
      }
    });

  } catch (error: any) {
    Logger.error(`[Queue Consumer] Failed to start consumer for ${RELEASE_QUEUE_NAME}: ${error.message}`);
    throw error;
  }
}
