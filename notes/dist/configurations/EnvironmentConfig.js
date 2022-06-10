"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const enums_1 = require("../typization/enums");
class EnvironmentConfig {
    constructor() {
        this.configure = () => {
            dotenv.config({ path: process.env.NODE_ENV === enums_1.NodeEnvs.TEST ? './.env.test' : './.env' });
        };
    }
}
exports.default = EnvironmentConfig;
