"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaReceiver = exports.KafkaSender = void 0;
const kafkajs_1 = require("kafkajs");
class KafkaSender {
    constructor() {
        this.kafkaClient = new kafkajs_1.Kafka({
            clientId: "notes",
            brokers: [process.env.KAFKA_BROKER],
        });
        this.producer = this.kafkaClient.producer();
    }
}
exports.KafkaSender = KafkaSender;
class KafkaReceiver {
    constructor() {
        this.kafkaClient = new kafkajs_1.Kafka({
            clientId: "notes",
            brokers: [process.env.KAFKA_BROKER],
        });
        this.consumer = this.kafkaClient.consumer({
            groupId: "emails-group",
        });
    }
}
exports.KafkaReceiver = KafkaReceiver;
