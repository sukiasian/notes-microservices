"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = exports.AppConfig = void 0;
const express = require("express");
const cookieParser = require("cookie-parser");
const Router_1 = require("./Router");
const User_1 = require("./User");
const sequelize_typescript_1 = require("sequelize-typescript");
const constants_1 = require("./typization/constants");
const GlobalErrorController_1 = require("./controllers/GlobalErrorController");
const EnvironmentConfig_1 = require("./configurations/EnvironmentConfig");
class AppConfig {
    constructor() {
        this.app = express();
        this.sequelize = new sequelize_typescript_1.Sequelize({
            dialect: "postgres",
            dialectOptions: {
                multipleStatements: true,
            },
            host: "postgres",
            port: Number.parseInt(process.env.POSTGRES_PORT, 10) || 5432,
            username: process.env.USER || "postgres",
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User_1.User],
            logging: false,
        });
        this.configureApp = () => {
            this.app.use(express.json({ limit: "10Kb" }));
            this.app.use(cookieParser());
            this.app.use(constants_1.mainRoute, Router_1.default);
            this.app.use(GlobalErrorController_1.default);
        };
    }
}
exports.AppConfig = AppConfig;
console.log(3333333);
EnvironmentConfig_1.default.configure();
console.log(process.env.USER);
exports.appConfig = new AppConfig();
exports.appConfig.configureApp();
