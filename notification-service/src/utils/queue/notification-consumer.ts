import { channel, NOTIFICATION_QUEUE_NAME } from '../../config/queue.js';
import { Logger } from '../../config/index.js';
import { sendBookingConfirmation } from '../../services/email-service.js';

export async function startNotificationQueueConsumer() {
  try {
    await channel.consume(NOTIFICATION_QUEUE_NAME, async (msg: any) => {
      if (!msg) return;

      try {
        const payload = JSON.parse(msg.content.toString());
        await sendBookingConfirmation(payload);
        channel.ack(msg);
      } catch (error: any) {
        Logger.error(`[Notification Service] Error processing message: ${error.message}`);
        channel.nack(msg, false, true);
      }
    });
  } catch (error: any) {
    Logger.error(`[Notification Service] Failed to start queue consumer: ${error.message}`);
    throw error;
  }
}
