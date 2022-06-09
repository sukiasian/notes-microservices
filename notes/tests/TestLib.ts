import * as express from 'express';
import * as faker from 'faker';
import * as jwt from 'jsonwebtoken';
import AppConfig from '../AppConfig';
import informationalLogger from '../loggers/informationalLogger';
import { Sequelize } from 'sequelize-typescript';
import connectToDb from '../database/connectToDb';
import EnvironmentConfig from '../configurations/EnvironmentConfig';
import { CreateNoteData } from '../typization/interfaces';

const environmentConfig = new EnvironmentConfig();

environmentConfig.configure('./.env.test');

export default class TestLib {
    private faker = faker;

    public startServer = (app: express.Application): object => {
        return app.listen(process.env.PORT, () => {
            informationalLogger.info('Test server is listening');
        });
    };

    public startDb = async (sequelize: Sequelize): Promise<void> => {
        await connectToDb(sequelize);
    };

    public closeServer = async (server: any): Promise<void> => {
        await server.close();
    };

    public closeDb = async (sequelize: Sequelize): Promise<void> => {
        await sequelize.close();

        informationalLogger.info('Database connection is closed');
    };

    public clearDb = (sequelize: Sequelize): void => {
        Promise.all(
            Object.values(sequelize.models).map(async (model) => {
                await model.destroy({ truncate: true, cascade: true });
            })
        );
    };

    public createFakeUserData = () => {
        const password = 'testtestpass';

        return {
            firstName: this.faker.name.firstName(),
            middleName: this.faker.name.middleName(),
            lastName: this.faker.name.lastName(),
            email: this.faker.internet.email(),
            password,
            passwordConfirmation: password,
        };
    };

    public createFakeNoteData = (userId: string): CreateNoteData => {
        return {
            userId,
            content: this.faker.random.words(),
        };
    };

    public createTokenAndSign = <T extends object | string>(payload: T): string => {
        return jwt.sign(payload, process.env.JWT_SECRET_KEY);
    };

    public openTestEnv = async (appConfig: AppConfig): Promise<{ server: object }> => {
        appConfig.setupPassport();
        appConfig.configure();

        await this.startDb(appConfig.sequelize);

        const server = this.startServer(appConfig.app);

        return {
            server,
        };
    };

    public closeTestEnv = async (sequelize: Sequelize, server: any): Promise<void> => {
        await this.closeDb(sequelize);
        await this.closeServer(server);
    };
}
