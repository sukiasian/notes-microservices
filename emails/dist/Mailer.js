"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
class Mailer {
    constructor() {
        this.sendMail = async (options) => {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST,
                    port: parseInt(process.env.EMAIL_PORT, 10),
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });
                let html;
                const mailOptions = {
                    from: options.from,
                    to: options.to,
                    subject: options.subject,
                    html,
                    text: options.text,
                };
                await transporter.sendMail(mailOptions);
            }
            catch (err) {
                throw new Error(err.message);
            }
        };
    }
}
exports.default = Mailer;
