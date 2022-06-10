"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cookieParser = require("cookie-parser");
const User_1 = require("./User");
const sequelize_typescript_1 = require("sequelize-typescript");
const cors = require("cors");
const GlobalErrorController_1 = require("./controllers/GlobalErrorController");
const enums_1 = require("./typization/enums");
const UserRouterConfig_1 = require("./routers/UserRouterConfig");
const AuthRouterConfig_1 = require("./routers/AuthRouterConfig");
const PassportConfig_1 = require("./configurations/PassportConfig");
const AppError_1 = require("./utils/AppError");
class AppConfig {
    constructor() {
        this.passportConfig = PassportConfig_1.passportConfig;
        this.app = express();
        this.sequelize = new sequelize_typescript_1.Sequelize({
            dialect: 'postgres',
            dialectOptions: {
                multipleStatements: true,
            },
            host: process.env.POSTGRES_HOST || 'postgres',
            port: Number.parseInt(process.env.POSTGRES_PORT, 10) || 5432,
            username: process.env.USER || 'postgres',
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User_1.User],
            logging: false,
        });
        this.corsWhiteList = ['http://notes:8000'];
        this.setupPassport = () => {
            this.passportConfig.configure();
        };
        this.configure = () => {
            this.app.use(express.json({ limit: '10Kb' }));
            this.app.use(cors({
                origin: (origin, callback) => {
                    if (this.corsWhiteList.indexOf(origin) !== -1 || !origin) {
                        callback(null, true);
                    }
                    else {
                        callback(new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.NOT_ENOUGH_RIGHTS));
                    }
                },
            }));
            this.app.use(cookieParser());
            this.app.use(this.passportConfig.initialize());
            this.app.use(enums_1.Routes.AUTH, AuthRouterConfig_1.default);
            this.app.use(enums_1.Routes.USER, UserRouterConfig_1.default);
            this.app.use(GlobalErrorController_1.default);
        };
    }
}
exports.default = AppConfig;
