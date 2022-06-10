"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const AppConfig_1 = require("./AppConfig");
const UtilFunctions_1 = require("./utils/UtilFunctions");
const connectToDb_1 = require("./database/connectToDb");
const informationalLogger_1 = require("./loggers/informationalLogger");
const EnvironmentConfig_1 = require("./configurations/EnvironmentConfig");
class Server {
    constructor() {
        this.appConfig = exports.appConfig;
        this.app = exports.appConfig.app;
        this.PORT = process.env.PORT || 5000;
        this.informationalLogger = informationalLogger_1.default;
        this.utilFunctions = UtilFunctions_1.default;
        this.start = async () => {
            await connectToDb_1.default(this.appConfig.sequelize);
            const server = this.app.listen(this.PORT, () => {
                this.informationalLogger.info(`Server is listening on ${this.PORT}`);
            });
            this.utilFunctions.exitHandler(server, this.appConfig.sequelize);
        };
    }
}
const environmentConfig = new EnvironmentConfig_1.default();
environmentConfig.configure();
exports.appConfig = new AppConfig_1.default();
exports.appConfig.setupPassport();
exports.appConfig.configure();
console.log(process.env.KAFKA_BROKER);
exports.appConfig.startConsumptionForActiveProducers();
const server = new Server();
server.start();
