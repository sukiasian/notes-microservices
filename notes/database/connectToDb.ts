import { Sequelize } from 'sequelize-typescript';
import errorLogger from '../loggers/errorLogger';
import informationalLogger from '../loggers/informationalLogger';
import { NodeEnvs } from '../typization/enums';

export default async (sequelize: Sequelize): Promise<void> => {
    try {
        await sequelize.sync({
            force: process.env.NODE_ENV !== NodeEnvs.PRODUCTION ? true : false,
        });

        informationalLogger.info('Synchronized.');
    } catch (err) {
        errorLogger.error(err);
    }
};
