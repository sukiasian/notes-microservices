"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaReceiver = exports.KafkaSender = void 0;
const kafkajs_1 = require("kafkajs");
const User_1 = require("./User");
const v8_1 = require("v8");
class KafkaSender {
    constructor() {
        this.model = User_1.User;
        this.kafkaClient = new kafkajs_1.Kafka({
            clientId: 'notes',
            brokers: [process.env.KAFKA_BROKER],
        });
        this.producer = this.kafkaClient.producer();
        this.queueUserData = async (userId) => {
            const user = await this.model.findOne({ where: { id: userId } });
            await this.producer.connect();
            await this.producer.send({
                topic: 'user-data',
                messages: [
                    {
                        value: v8_1.serialize(user),
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
        this.model = User_1.User;
        this.kafkaClient = new kafkajs_1.Kafka({
            clientId: 'notes',
            brokers: [process.env.KAFKA_BROKER],
        });
        this.consumer = this.kafkaClient.consumer({ groupId: 'passport-group' });
        this.acceptJwt = async (cb) => {
            try {
                await this.consumer.connect();
                await this.consumer.subscribe({ topic: 'jwt', fromBeginning: true });
                let id;
                await this.consumer.run({
                    eachMessage: async ({ topic, partition, message }) => {
                        id = v8_1.deserialize(message.value).id;
                        cb(id);
                    },
                });
            }
            catch (_a) {
                throw new Error('Something went wrong.');
            }
        };
    }
}
exports.KafkaReceiver = KafkaReceiver;
