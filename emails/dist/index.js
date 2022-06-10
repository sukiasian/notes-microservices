"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const v8_1 = require("v8");
const dotenv = require("dotenv");
const EmailOptions_1 = require("./EmailOptions");
const kafka_1 = require("./kafka");
const Mailer_1 = require("./Mailer");
dotenv.config({ path: ".env" });
const kafkaReceiver = new kafka_1.KafkaReceiver();
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
                const email = v8_1.deserialize(message.value);
                const mailer = new Mailer_1.default();
                setInterval(() => {
                    const mailOptions = new EmailOptions_1.default(email, "Greetings From Notes Inc!", "Welcome to Notes App!");
                    mailer.sendMail(mailOptions);
                }, 1000);
            },
        });
    }
    catch (err) {
        console.log("Error occured", err);
    }
})();
