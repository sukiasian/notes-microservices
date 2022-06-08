"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppConfig_1 = require("./AppConfig");
const process = require("process");
const UtilFunctions_1 = require("./utils/UtilFunctions");
const connectToDb_1 = require("./database/connectToDb");
const enums_1 = require("./typization/enums");
const informationalLogger_1 = require("./loggers/informationalLogger");
class Server {
    constructor() {
        this.appConfig = AppConfig_1.appConfig;
        this.app = AppConfig_1.appConfig.app;
        this.PORT = process.env.PORT || 8000;
        this.informationalLogger = informationalLogger_1.default;
        this.utilFunctions = UtilFunctions_1.default;
        this.start = async () => {
            await connectToDb_1.default(this.appConfig.sequelize);
            const server = this.app.listen(this.PORT, () => {
                this.informationalLogger.info(`Server is listening on ${this.PORT}`);
                if (process.env.NODE_ENV === enums_1.NodeEnvs.PRODUCTION) {
                    process.send("Server is ready.");
                }
            });
            this.utilFunctions.exitHandler(server, this.appConfig.sequelize);
        };
    }
}
const server = new Server();
server.start();
