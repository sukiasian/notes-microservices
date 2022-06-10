import { Kafka } from 'kafkajs';
import { serialize, deserialize } from 'v8';
import { Note } from './Note';
import { ErrorMessages, HttpStatus } from './typization/enums';
import AppError from './utils/AppError';

export class KafkaSender {
    private readonly model: typeof Note = Note;
    public readonly kafkaClient = new Kafka({
        clientId: 'notes',
        brokers: [process.env.KAFKA_BROKER],
    });
    private readonly producer = this.kafkaClient.producer();

    queueUserJwt = async (jwt: string) => {
        await this.producer.connect();
        await this.producer.send({
            topic: 'jwt',
            messages: [
                {
                    value: serialize(jwt),
                },
            ],
        });
        await this.producer.disconnect();
    };
}

export class KafkaReceiver {
    private readonly model: typeof Note = Note;
    public readonly kafkaClient = new Kafka({
        clientId: 'notes',
        brokers: [process.env.KAFKA_BROKER],
    });
    public readonly consumer = this.kafkaClient.consumer({ groupId: 'notes-group' });

    acceptUserData = async (done) => {
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: 'user-data', fromBeginning: true });

        let user;

        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(deserialize(message.value), 'valueeeeee');
                user = deserialize(message.value);

                if (!user) {
                    return done(new AppError(HttpStatus.FORBIDDEN, ErrorMessages.USER_NOT_FOUND), false);
                }
                // cb(user)
                // await this.consumer.disconnect();
            },
        });

        console.log(user, 'useeeeee');

        return user;
    };
}
