export default class EmailOptions {
    from = "Notes App";
    to: string;
    subject: string;
    text?: string;

    constructor(to: string, text?: string) {
        this.to = to;

        if (text) {
            this.text = text;
        }
    }
}
