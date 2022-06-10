import AppConfig from './AppConfig';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import UtilFunctions from './utils/UtilFunctions';
import databaseConnection from './database/connectToDb';
import { AbstractServer } from './typization/abstractClasses';
import informationalLogger from './loggers/informationalLogger';
import { Logger } from 'winston';
import { Application } from 'express';
import EnvironmentConfig from './configurations/EnvironmentConfig';

class Server implements AbstractServer {
    private readonly appConfig: AppConfig = appConfig;
    private readonly app: Application = appConfig.app;
    private readonly PORT: string | number = process.env.PORT || 5000;
    private readonly informationalLogger: Logger = informationalLogger;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public start = async () => {
        await databaseConnection(this.appConfig.sequelize);

        const server = this.app.listen(this.PORT, () => {
            this.informationalLogger.info(`Server is listening on ${this.PORT}`);
        });

        this.utilFunctions.exitHandler(server, this.appConfig.sequelize);
    };
}

const environmentConfig = new EnvironmentConfig();

environmentConfig.configure();

export const appConfig = new AppConfig();

appConfig.setupPassport();
appConfig.configure();
console.log(process.env.KAFKA_BROKER);
appConfig.startConsumptionForActiveProducers();

const server = new Server();

server.start();
