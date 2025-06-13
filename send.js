const amqp = require('amqplib');

async function sendMessage() {
  const queue = 'hello';
  const msg = 'Hello from Node.js';

  const connection = await amqp.connect('amqp://user:password@localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: false });

  channel.sendToQueue(queue, Buffer.from(msg));
  console.log(` [x] Sent '${msg}'`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

sendMessage().catch(console.error);
