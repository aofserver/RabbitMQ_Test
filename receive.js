const amqp = require('amqplib');

async function receiveMessage() {
  const queue = 'hello';

  const connection = await amqp.connect('amqp://user:password@localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: false });

  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      console.log(" [x] Received:", msg.content.toString());
      channel.ack(msg);
    }
  });
}

receiveMessage().catch(console.error);
