"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const informationalLogger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.simple(), winston.format.errors({ stack: true }), winston.format.json()),
        }),
    ],
});
exports.default = informationalLogger;
