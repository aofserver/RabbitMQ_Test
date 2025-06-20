const amqp = require('amqplib');
const crypto = require('crypto');
const configs = require("./configs/app")

const QUEUE_NAME = 'qTest';
const EXCHANGE_TYPE = 'topic';
const EXCHANGE_NAME = 'exTest';
const KEY = 'testKey';
const connection = await amqp.connect(`amqp://${configs.rabbitUser}:${configs.rabbitPass}@${configs.rabbitHost}?heartbeat=60`);

connection.then(async (con) => {
    console.log("[ INFO ] Rabbit Connected!")
    const channel = await con.createChannel();
    channel.consume(QUEUE_NAME, async (msg) => {
        var data = JSON.parse(msg.content.toString())
        console.log("routingKey : ", msg.fields.routingKey)
        console.log("data : ", data)

        await channel.publish(
            "amq.topic",
            KEY,
            Buffer.from(JSON.stringify(data)),
            { "test": "test" }
        );

        channel.ack(msg)
    }, { consumerTag: `app_${crypto.randomBytes(5).toString('hex')}` })
})