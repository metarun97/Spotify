import amqp from "amqplib";
import config from "../config/config.js";


let channel, connection;

/* Connect RabbitMQ and creating a channel */
export const connect = async () => {

  connection = await amqp.connect(config.RABBITMQ_URI);

  channel = await connection.createChannel();

  console.log("Connected to RabbitMQ!");
}


/* Publish to queue */
export const publishToQueue = async (queueName, data) => {

  await channel.assertQueue(queueName, { durable: true });

  await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));

  console.log("Message send to queue", queueName);

}
