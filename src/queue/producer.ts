import amqp from 'amqplib';
import { QueueModel } from '../model/QueueModel';

export const publishToQueue = async (queueName: string, data: QueueModel) => {
    const RABBITMQ_URL = process.env.RABBITMQ_URL;
    if (!RABBITMQ_URL) {
        console.warn('Error: RABBITMQ_URL is not set');
        return;
    }
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
        console.log(`Message sent to queue: ${queueName}`);
        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error publishing to queue:', error);
        throw error;
    }
};