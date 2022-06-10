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
        this.queueNewUserEmail = async (email) => {
            await this.producer.connect();
            await this.producer.send({
                topic: 'new-user-email',
                messages: [
                    {
                        value: v8_1.serialize(email),
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
    }
}
exports.KafkaReceiver = KafkaReceiver;
