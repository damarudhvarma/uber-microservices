import amqp from 'amqplib';
import dotevn from 'dotenv';
dotevn.config();

let connection, channel;

export async function connect() {
    connection = await amqp.connect(process.env.RABBIT_URL);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
   
}

export async function subscribeToQueue(queueName, callback) {
    if (!channel) await connect();
    await channel.assertQueue(queueName);
    channel.consume(queueName, (message) => {
        callback(message.content.toString());
        channel.ack(message);
    });
}

export async function publishToQueue(queueName, data) {
    if (!channel) await connect();
    await channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(data));
}