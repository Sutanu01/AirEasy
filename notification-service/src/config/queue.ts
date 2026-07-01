import amqplib from 'amqplib';
import Logger from './logger-config.js';
import ServerConfig from './server-config.js';

let connection: any;
let channel: any;

export const NOTIFICATION_QUEUE_NAME = 'booking_notification_queue';

async function connectWithRetry(retries = 5, delay = 5000): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      Logger.info(`[Notification Service] Connecting to RabbitMQ (Attempt ${i + 1}/${retries})...`);
      return await amqplib.connect(ServerConfig.RABBITMQ_URL);
    } catch (error: any) {
      Logger.error(`[Notification Service] Connection failed: ${error.message}. Retrying in ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Could not connect to RabbitMQ after maximum retries');
}

export async function initializeQueue() {
  try {
    connection = await connectWithRetry();
    channel = await connection.createChannel();
    await channel.assertQueue(NOTIFICATION_QUEUE_NAME, { durable: true });
    Logger.info(`[Notification Service] Subscribed to queue "${NOTIFICATION_QUEUE_NAME}". Waiting for events...`);
  } catch (error: any) {
    Logger.error(`Failed to initialize RabbitMQ: ${error.message}`);
    throw error;
  }
}

export { connection, channel };
