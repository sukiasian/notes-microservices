"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorLogger_1 = require("../loggers/errorLogger");
const informationalLogger_1 = require("../loggers/informationalLogger");
const enums_1 = require("../typization/enums");
exports.default = async (sequelize) => {
    try {
        await sequelize.sync({
            force: process.env.NODE_ENV !== enums_1.NodeEnvs.PRODUCTION ? true : false,
        });
        const syncOptions = {
            force: false,
        };
        await sequelize.sync(syncOptions);
        console.log(await sequelize.getDatabaseName());
        informationalLogger_1.default.info("Synchronized.");
    }
    catch (err) {
        errorLogger_1.default.error(err);
    }
};
