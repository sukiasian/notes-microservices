"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cookieParser = require("cookie-parser");
const Note_1 = require("./Note");
const sequelize_typescript_1 = require("sequelize-typescript");
const GlobalErrorController_1 = require("./controllers/GlobalErrorController");
const enums_1 = require("./typization/enums");
const PassportConfig_1 = require("./configurations/PassportConfig");
const RouterConfig_1 = require("./RouterConfig");
const routerConfig = new RouterConfig_1.default();
routerConfig.configure();
const passportConfig = new PassportConfig_1.default();
class AppConfig {
    constructor() {
        this.passportConfig = passportConfig;
        this.app = express();
        this.sequelize = new sequelize_typescript_1.Sequelize({
            dialect: 'postgres',
            dialectOptions: {
                multipleStatements: true,
            },
            host: process.env.POSTGRES_HOST || 'db_notes',
            port: Number.parseInt(process.env.POSTGRES_PORT, 10) || 5432,
            username: process.env.USER || 'postgres',
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [Note_1.Note],
            logging: false,
        });
        this.router = routerConfig.router;
        this.setupPassport = () => {
            this.passportConfig.configure();
        };
        this.configure = () => {
            this.app.use(express.json({ limit: '10Kb' }));
            this.app.use(cookieParser());
            this.app.use(this.passportConfig.initialize());
            this.app.use(enums_1.Routes.NOTES, this.router);
            this.app.use(GlobalErrorController_1.default);
        };
    }
}
exports.default = AppConfig;
