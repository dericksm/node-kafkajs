import { Kafka, logLevel } from 'kafkajs'


const kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: "certificate",
    logLevel: logLevel.WARN,
})

const topic = 'issue-certificate'
const consumer = kafka.consumer({ groupId: "certificate-group" })
const producer = kafka.producer();

async function run() {
    await producer.connect()
    await consumer.connect()
    
    await consumer.subscribe({ topic })
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
            setTimeout(() => {
                producer.send({
                    topic: "certification-response",
                    messages: [
                        { value: "Certificado emitido" }
                    ]
                })
            }, 3000);
        }
    })
}

run().catch(console.error)