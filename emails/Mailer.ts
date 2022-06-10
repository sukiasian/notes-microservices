import * as nodemailer from "nodemailer";
import EmailOptions from "./EmailOptions";

export default class Mailer {
    sendMail = async (options: EmailOptions): Promise<void> => {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT, 10),
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            } as nodemailer.TransportOptions);

            let html: string;

            const mailOptions = {
                from: options.from,
                to: options.to,
                subject: options.subject,
                html,
                text: options.text,
            };

            await transporter.sendMail(mailOptions);
        } catch (err) {
            throw new Error(err.message);
        }
    };
}
