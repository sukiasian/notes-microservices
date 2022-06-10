import { Kafka } from "kafkajs";
import { deserialize } from "v8";

export class KafkaSender {
    public readonly kafkaClient = new Kafka({
        clientId: "notes",
        brokers: [process.env.KAFKA_BROKER],
    });
    public readonly producer = this.kafkaClient.producer();
}

export class KafkaReceiver {
    public readonly kafkaClient = new Kafka({
        clientId: "notes",
        brokers: [process.env.KAFKA_BROKER],
    });
    public readonly consumer = this.kafkaClient.consumer({
        groupId: "emails-group",
    });
}
