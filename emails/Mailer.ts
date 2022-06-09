import * as nodemailer from "nodemailer";
import EmailOptions from "./EmailOptions";

class Mailer {
    sendMail = async <TLocals>(
        options: EmailOptions,
        relativePathToTemplate?: string,
        locals?: TLocals
    ): Promise<void> => {
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

            // if (relativePathToTemplate) {
            //     const pugTemplate = pug.compileFile(path.resolve('emails', 'templates', relativePathToTemplate));
            //     html = pugTemplate(locals);
            // }

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
