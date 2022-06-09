import { Sequelize } from "sequelize-typescript";
import { SyncOptions } from "sequelize/types";
import errorLogger from "../loggers/errorLogger";
import informationalLogger from "../loggers/informationalLogger";
import { NodeEnvs } from "../typization/enums";

export default async (sequelize: Sequelize): Promise<void> => {
    try {
        await sequelize.sync({
            force: process.env.NODE_ENV !== NodeEnvs.PRODUCTION ? true : false,
        });

        const syncOptions: SyncOptions = {
            force: false,
        };

        await sequelize.sync(syncOptions);
        console.log(await sequelize.getDatabaseName());

        informationalLogger.info("Synchronized.");
    } catch (err) {
        errorLogger.error(err);
    }
};
