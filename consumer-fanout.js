const amqp = require('amqplib');
const configs = require("./configs/app")

async function receiveFanoutMessages() {
    let connection;
    try {
        const connection = await amqp.connect(`amqp://${configs.rabbitUser}:${configs.rabbitPass}@${configs.rabbitHost}?heartbeat=60`);
        const channel = await connection.createChannel();

        const exchangeName = 'fanout_broadcast';
        // Declare the same fanout exchange
        await channel.assertExchange(exchangeName, 'fanout', {
            durable: false
        });

        // Declare an anonymous, exclusive, auto-delete queue
        const q = await channel.assertQueue('', {
            exclusive: true,
            autoDelete: true
        });
        console.log(`[*] Waiting for broadcast messages in queue: ${q.queue}. To exit press CTRL+C`);

        // Bind the queue to the fanout exchange (binding key is ignored)
        await channel.bindQueue(q.queue, exchangeName, '');

        channel.consume(q.queue, (msg) => {
            if (msg.content) {
                console.log(`[x] Received broadcast: '${msg.content.toString()}'`);
            }
        }, {
            noAck: true
        });
    } catch (error) {
        console.error('Error in consumer-fanout:', error.message);
    }
}

receiveFanoutMessages();