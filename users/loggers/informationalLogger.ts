import * as winston from "winston";

const informationalLogger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.simple(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            ),
        }),
    ],
});

export default informationalLogger;
