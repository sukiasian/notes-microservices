import { Kafka, KafkaMessage } from 'kafkajs';
import { User } from './User';
import { serialize, deserialize } from 'v8';

export class KafkaSender {
    private readonly model: typeof User = User;
    private readonly kafkaClient = new Kafka({
        clientId: 'notes',
        brokers: [process.env.KAFKA_BROKER],
    });
    private readonly producer = this.kafkaClient.producer();

    public queueUserData = async (userId: string) => {
        const user = await this.model.findOne({ where: { id: userId } });

        await this.producer.connect();
        await this.producer.send({
            topic: 'user-data',
            messages: [
                {
                    value: serialize(user),
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

    public acceptJwt = async (cb: (jwt: string) => Promise<void>) => {
        try {
            await this.consumer.connect();
            await this.consumer.subscribe({ topic: 'jwt', fromBeginning: true });

            let id: string | KafkaMessage;

            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    id = deserialize(message.value).id;
                    cb(id as string);
                },
            });
        } catch {
            throw new Error('Something went wrong.');
        }
    };
}
