import AppConfig from './AppConfig';
import * as process from 'process';
import UtilFunctions from './utils/UtilFunctions';
import databaseConnection from './database/connectToDb';
import { AbstractServer } from './typization/abstractClasses';
import { NodeEnvs } from './typization/enums';
import informationalLogger from './loggers/informationalLogger';
import { Logger } from 'winston';
import { Application } from 'express';
import EnvironmentConfig from './configurations/EnvironmentConfig';

class Server implements AbstractServer {
    private readonly appConfig: AppConfig = appConfig;
    private readonly app: Application = appConfig.app;
    private readonly PORT: string | number = process.env.PORT || 8000;
    private readonly informationalLogger: Logger = informationalLogger;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public start = async () => {
        await databaseConnection(this.appConfig.sequelize);

        const server = this.app.listen(this.PORT, () => {
            this.informationalLogger.info(`Server is listening on ${this.PORT}`);

            if (process.env.NODE_ENV === NodeEnvs.PRODUCTION) {
                process.send('Server is ready.');
            }
        });

        this.utilFunctions.exitHandler(server, this.appConfig.sequelize);
    };
}

const environmentConfig = new EnvironmentConfig();

environmentConfig.configure('./.env');

export const appConfig = new AppConfig();

appConfig.setupPassport();
appConfig.configure();

const server = new Server();

server.start();
