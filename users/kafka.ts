import { Kafka } from 'kafkajs';
import { User } from './User';
import { serialize } from 'v8';

export class KafkaSender {
    private readonly model: typeof User = User;
    private readonly kafkaClient = new Kafka({
        clientId: 'notes',
        brokers: [process.env.KAFKA_BROKER],
    });
    private readonly producer = this.kafkaClient.producer();

    public queueNewUserEmail = async (email: string) => {
        await this.producer.connect();
        await this.producer.send({
            topic: 'new-user-email',
            messages: [
                {
                    value: serialize(email),
                },
            ],
        });

        await this.producer.disconnect();
    };
}

export class KafkaReceiver {
    private readonly model: typeof User = User;
    private readonly kafkaClient = new Kafka({
        clientId: 'notes',
        brokers: [process.env.KAFKA_BROKER],
    });
    private readonly consumer = this.kafkaClient.consumer({ groupId: 'passport-group' });
}
