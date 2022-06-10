export default class EmailOptions {
    from = "Notes App";
    to: string;
    subject: string;
    text?: string;

    constructor(to: string, subject: string, text?: string) {
        this.to = to;
        this.subject = subject;

        if (text) {
            this.text = text;
        }
    }
}
