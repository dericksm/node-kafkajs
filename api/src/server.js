import express from "express"
import { Kafka, logLevel } from "kafkajs"
import routes from "./routes"

const app = express()

// connect to kafka
const kafka = new Kafka({
    clientId: "api",
    brokers: ['localhost:9092'],
    retry: {
        initialRetryTime: 300,
        retries: 10
    },
    logLevel: logLevel.WARN
})

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: "certificate-group-receiver" })

// allows producer to be used in every route
app.use((req, res, next) => {
    req.producer = producer;
    return next();
})

app.use(routes)

async function run() {
    await producer.connect()
    await consumer.connect()

    await consumer.subscribe({ topic: "certification-response" })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log("Response", message)
        }
    })

    app.listen(3333)
}

run().catch(console.error)