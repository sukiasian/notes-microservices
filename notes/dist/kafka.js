"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaReceiver = exports.KafkaSender = void 0;
const kafkajs_1 = require("kafkajs");
const v8_1 = require("v8");
const Note_1 = require("./Note");
class KafkaSender {
    constructor() {
        this.model = Note_1.Note;
        this.kafkaClient = new kafkajs_1.Kafka({
            clientId: 'notes',
            brokers: [process.env.KAFKA_BROKER],
        });
        this.producer = this.kafkaClient.producer();
        this.queueUserJwt = async (jwt) => {
            await this.producer.connect();
            await this.producer.send({
                topic: 'jwt',
                messages: [
                    {
                        value: v8_1.serialize(jwt),
                    },
                ],
            });
            await this.producer.disconnect();
        };
    }
}
exports.KafkaSender = KafkaSender;
class KafkaReceiver {
    constructor() {
        this.model = Note_1.Note;
        this.kafkaClient = new kafkajs_1.Kafka({
            clientId: 'notes',
            brokers: [process.env.KAFKA_BROKER],
        });
        this.consumer = this.kafkaClient.consumer({ groupId: 'notes-group' });
        this.acceptUserData = async (done) => {
            await this.consumer.connect();
            await this.consumer.subscribe({ topic: 'user-data', fromBeginning: true });
            let user;
            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log(v8_1.deserialize(message.value), 'valueeeeee');
                    user = v8_1.deserialize(message.value);
                },
            });
            return user;
        };
    }
}
exports.KafkaReceiver = KafkaReceiver;
