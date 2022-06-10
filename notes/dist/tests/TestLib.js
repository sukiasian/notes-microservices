"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker = require("faker");
const jwt = require("jsonwebtoken");
const informationalLogger_1 = require("../loggers/informationalLogger");
const connectToDb_1 = require("../database/connectToDb");
const EnvironmentConfig_1 = require("../configurations/EnvironmentConfig");
const environmentConfig = new EnvironmentConfig_1.default();
environmentConfig.configure();
class TestLib {
    constructor() {
        this.faker = faker;
        this.startServer = (app) => {
            return app.listen(process.env.PORT, () => {
                informationalLogger_1.default.info('Test server is listening');
            });
        };
        this.startDb = async (sequelize) => {
            await connectToDb_1.default(sequelize);
        };
        this.closeServer = async (server) => {
            await server.close();
        };
        this.closeDb = async (sequelize) => {
            await sequelize.close();
            informationalLogger_1.default.info('Database connection is closed');
        };
        this.clearDb = (sequelize) => {
            Promise.all(Object.values(sequelize.models).map(async (model) => {
                await model.destroy({ truncate: true, cascade: true });
            }));
        };
        this.createFakeUserData = () => {
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
        this.createFakeNoteData = (userId) => {
            return {
                userId,
                content: this.faker.random.words(),
            };
        };
        this.createTokenAndSign = (payload) => {
            return jwt.sign(payload, process.env.JWT_SECRET_KEY);
        };
        this.openTestEnv = async (appConfig) => {
            appConfig.setupPassport();
            appConfig.configure();
            await this.startDb(appConfig.sequelize);
            const server = this.startServer(appConfig.app);
            return {
                server,
            };
        };
        this.closeTestEnv = async (sequelize, server) => {
            await this.closeDb(sequelize);
            await this.closeServer(server);
        };
    }
}
exports.default = TestLib;
