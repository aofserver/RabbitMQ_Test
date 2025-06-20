const amqp = require('amqplib');
const configs = require("./configs/app")

const QUEUE_NAME = 'qTest';
const EXCHANGE_TYPE = 'topic';
const EXCHANGE_NAME = 'exTest';
const KEY = 'testKey';
// const numbers = ['100', '200', '300', '400', '500']
var data = { "data": "test" }
const connection = await amqp.connect(`amqp://${configs.rabbitUser}:${configs.rabbitPass}@${configs.rabbitHost}?heartbeat=60`);

connection.then(async (con) => {
    console.log("[ INFO ] Rabbit Connected!")
    const channel = await con.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE);
    await channel.assertQueue(QUEUE_NAME);
    channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, KEY);
    console.log("send : ", JSON.stringify(data))
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(data)))
})

// connection.close();

// setTimeout(()=>{
//     connection.close();
//     process.exit(0)
// }, 1000);