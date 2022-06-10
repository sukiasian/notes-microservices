"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmailOptions {
    constructor(to, subject, text) {
        this.from = "Notes App";
        this.to = to;
        this.subject = subject;
        if (text) {
            this.text = text;
        }
    }
}
exports.default = EmailOptions;
