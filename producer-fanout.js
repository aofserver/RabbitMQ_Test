const amqp = require('amqplib');
const configs = require("./configs/app")

async function sendFanoutMessage(message) {
    let connection;
    try {
        const connection = await amqp.connect(`amqp://${configs.rabbitUser}:${configs.rabbitPass}@${configs.rabbitHost}?heartbeat=60`);
        const channel = await connection.createChannel();

        const exchangeName = 'fanout_broadcast';
        // Declare a fanout exchange
        await channel.assertExchange(exchangeName, 'fanout', {
            durable: false
        });

        // Publish the message (routing key is ignored for fanout)
        channel.publish(exchangeName, '', Buffer.from(message));
        console.log(`[x] Sent: '${message}' to all connected queues`);

        await channel.close();
    } catch (error) {
        console.error('Error in producer-fanout:', error.message);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

// Example usage:
sendFanoutMessage('Emergency broadcast: All systems offline!');
setTimeout(() => sendFanoutMessage('Regular update: Everything is nominal.'), 1000);