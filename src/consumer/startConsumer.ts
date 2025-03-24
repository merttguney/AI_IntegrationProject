import amqp from 'amqplib';
import * as Sentry from '@sentry/node';
import { QueueModel } from '../model/QueueModel';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';


export const startConsumer = async (queueName: string,
    callback: (queueItem: QueueModel) => Promise<void>) => {
    try {
      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();
      await channel.assertQueue(queueName, { durable: true });
  
      console.log(`Waiting for messages in queue: ${queueName}`);
  
      channel.consume(queueName, async (msg) => {
        if (msg) {
          const data = JSON.parse(msg.content.toString());
          console.log(`Processing message:`, data);
  
          try {
            await callback(data)
            channel.ack(msg);
          } catch (error) {
            console.error('Error processing message:', error);
            Sentry.captureException(error);
            channel.nack(msg, false, true); // Requeue message for retry
          }
        }
      });
    } catch (error) {
      console.error('Error starting consumer:', error);
      Sentry.captureException(error);
    }
  };