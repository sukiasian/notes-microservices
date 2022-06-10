import { deserialize } from "v8";
import * as dotenv from "dotenv";
import EmailOptions from "./EmailOptions";
import { KafkaReceiver } from "./kafka";
import Mailer from "./Mailer";

dotenv.config({ path: ".env" });

const kafkaReceiver = new KafkaReceiver();

(async () => {
    try {
        await kafkaReceiver.consumer.connect();
        await kafkaReceiver.consumer.subscribe({
            topic: "new-user-email",
            fromBeginning: true,
        });

        console.log("Emails service is ready.");

        await kafkaReceiver.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const email = deserialize(message.value);
                const mailer = new Mailer();

                setInterval(() => {
                    const mailOptions: EmailOptions = new EmailOptions(
                        email,
                        "Greetings From Notes Inc!",
                        "Welcome to Notes App!"
                    );

                    mailer.sendMail(mailOptions);
                }, 1000);
            },
        });
    } catch (err) {
        console.log("Error occured", err);
    }
})();
