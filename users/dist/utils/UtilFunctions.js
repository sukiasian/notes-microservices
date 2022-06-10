"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const errorLogger_1 = require("../loggers/errorLogger");
const informationalLogger_1 = require("../loggers/informationalLogger");
const enums_1 = require("../typization/enums");
class UtilFunctions {
}
exports.default = UtilFunctions;
UtilFunctions.informationalLogger = informationalLogger_1.default;
UtilFunctions.errorLogger = errorLogger_1.default;
UtilFunctions.signToken = jwt.sign;
UtilFunctions.catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
UtilFunctions.defineResponseStatus = (httpStatus) => {
    if (httpStatus >= enums_1.HttpStatus.OK && httpStatus < enums_1.HttpStatus.FORBIDDEN) {
        return enums_1.ResponseStatus.SUCCESS;
    }
    else if (httpStatus >= enums_1.HttpStatus.INTERNAL_SERVER_ERROR) {
        return enums_1.ResponseStatus.ERROR;
    }
    return enums_1.ResponseStatus.FAILURE;
};
UtilFunctions.signTokenAndStoreInCookies = async (res, jwtPayload, signOptions = {}) => {
    const token = UtilFunctions.signToken(jwtPayload, process.env.JWT_SECRET_KEY, signOptions);
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 90 * 24 * 3600000),
        secure: false,
    };
    if (process.env.NODE_ENV === enums_1.NodeEnvs.PRODUCTION) {
        cookieOptions.secure = true;
    }
    res.cookie('jwt', token, cookieOptions);
};
UtilFunctions.sendResponse = (res) => {
    return (statusCode, message, data) => {
        if (!message && data) {
            res.status(statusCode).json({
                status: UtilFunctions.defineResponseStatus(statusCode),
                data,
            });
        }
        else if (message && data !== undefined) {
            res.status(statusCode).json({
                status: UtilFunctions.defineResponseStatus(statusCode),
                message,
                data,
            });
        }
        else if (message && data === undefined) {
            res.status(statusCode).json({
                status: UtilFunctions.defineResponseStatus(statusCode),
                message,
            });
        }
        else {
            res.status(statusCode).json({
                status: UtilFunctions.defineResponseStatus(statusCode),
            });
        }
    };
};
UtilFunctions.exitHandler = (server, sequelize) => {
    process
        .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
        server.close((err) => {
            if (err) {
                UtilFunctions.errorLogger.error(err);
                process.exit(1);
            }
            sequelize.close().then(() => {
                UtilFunctions.errorLogger.error('Sequelize connection disconnected');
                process.exit(0);
            });
        });
    })
        .on('uncaughtException', (err) => {
        UtilFunctions.errorLogger.error('Uncaught Exception thrown', err);
        server.close((err) => {
            if (err) {
                UtilFunctions.errorLogger.error(err);
                process.exit(1);
            }
            sequelize.close().then(() => {
                UtilFunctions.informationalLogger.info('Sequelize connection disconnected');
                process.exit(0);
            });
        });
    })
        .on('SIGTERM', () => {
        console.info('SIGTERM signal received.');
        server.close((err) => {
            if (err) {
                UtilFunctions.errorLogger.error(err);
                process.exit(1);
            }
            sequelize.close().then(() => {
                UtilFunctions.informationalLogger.info('Sequelize connection disconnected');
                process.exit(0);
            });
        });
    })
        .on('SIGINT', function () {
        console.info('SIGINT signal received.');
        server.close((err) => {
            if (err) {
                UtilFunctions.errorLogger.error(err);
                process.exit(1);
            }
            sequelize.close().then(() => {
                UtilFunctions.informationalLogger.info('Sequelize connection disconnected');
                process.exit(0);
            });
        });
    });
};
