import amqplib from 'amqplib';
import Logger from './logger-config.js';
import ServerConfig from './server-config.js';

let connection: any;
let channel: any;


const RABBITMQ_URL = ServerConfig.RABBITMQ_URL;
const HOLD_TTL_MS = ServerConfig.BOOKING_HOLD_TTL_MS;

// Queue & Exchange Configuration Constants
export const DLX_EXCHANGE_NAME = 'booking_dead_letter_exchange';
export const RELEASE_QUEUE_NAME = 'booking_release_queue';
export const RELEASE_ROUTING_KEY = 'release_key';
export const HOLD_TTL_QUEUE_NAME = 'booking_hold_ttl';
export const NOTIFICATION_QUEUE_NAME = 'booking_notification_queue';

async function initializeQueue() {
  try {
    Logger.info(`Connecting to RabbitMQ at ${RABBITMQ_URL}...`);
    connection = await amqplib.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertExchange(DLX_EXCHANGE_NAME, 'direct', { durable: true });

    await channel.assertQueue(RELEASE_QUEUE_NAME, { durable: true });

    await channel.bindQueue(RELEASE_QUEUE_NAME, DLX_EXCHANGE_NAME, RELEASE_ROUTING_KEY);

    await channel.assertQueue(HOLD_TTL_QUEUE_NAME, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': DLX_EXCHANGE_NAME,
        'x-dead-letter-routing-key': RELEASE_ROUTING_KEY,
        'x-message-ttl': HOLD_TTL_MS // Messages expire automatically and go to DLX
      }
    });

    await channel.assertQueue(NOTIFICATION_QUEUE_NAME, { durable: true });

    Logger.info('RabbitMQ queues initialized successfully.');
  } catch (error: any) {
    Logger.error(`Failed to initialize RabbitMQ queues: ${error.message}`);
    throw error;
  }
}

export {
  initializeQueue,
  connection,
  channel
};
