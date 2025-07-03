import amqp from 'amqplib';
import { Channel, ConsumeMessage } from 'amqplib';
import { config } from '../config/config';

let connection: any = null;
let channel: Channel | null = null;

export async function connectRabbitMQ() {
  if (connection && channel) return { connection, channel };
  connection = await amqp.connect(config.rabbitmqUrl || 'amqp://localhost:5672');
  channel = await connection.createChannel();
  return { connection, channel };
}

export async function assertQueue(queueName: string) {
  const { channel } = await connectRabbitMQ();
  if (!channel) throw new Error('RabbitMQ channel yok');
  await channel.assertQueue(queueName, { durable: true });
}

export async function sendToQueue(queueName: string, message: object) {
  const { channel } = await connectRabbitMQ();
  if (!channel) throw new Error('RabbitMQ channel yok');
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
}

export async function consumeQueue(
  queueName: string,
  onMessage: (msg: ConsumeMessage | null, channel: Channel) => void
) {
  const { channel } = await connectRabbitMQ();
  if (!channel) throw new Error('RabbitMQ channel yok');
  await channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, (msg) => onMessage(msg, channel), { noAck: false });
}

export async function closeRabbitMQ() {
  if (channel) await channel.close();
  if (connection) await connection.close();
  channel = null;
  connection = null;
} 