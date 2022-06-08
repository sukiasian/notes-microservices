"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
class EnvironmentConfig {
    constructor() {
        this.configure = () => {
            dotenv.config({ path: "./.env" });
        };
    }
}
const environmentConfig = new EnvironmentConfig();
exports.default = environmentConfig;
