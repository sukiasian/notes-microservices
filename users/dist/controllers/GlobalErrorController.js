"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorLogger_1 = require("../loggers/errorLogger");
const enums_1 = require("../typization/enums");
class GlobalErrorController {
}
GlobalErrorController.errorLogger = errorLogger_1.default;
GlobalErrorController.sendErrorProd = (err, res) => {
    if (err.isOperational) {
        GlobalErrorController.errorLogger.error(`${err}, ${enums_1.ErrorMessages.APPLICATION_ERROR}`);
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        GlobalErrorController.errorLogger.error(`${err}, ${enums_1.ErrorMessages.UNKNOWN_ERROR}`);
        res.status(err.statusCode).json({
            status: err.status,
            message: enums_1.ErrorMessages.UNKNOWN_ERROR,
        });
    }
};
GlobalErrorController.sendErrorDev = (err, res) => {
    GlobalErrorController.errorLogger.error(`${err}`);
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
GlobalErrorController.sendErrorTest = (err, res) => {
    if (err.isOperational) {
        GlobalErrorController.errorLogger.error(`${err}, ${enums_1.ErrorMessages.APPLICATION_ERROR}`);
        res.status(err.statusCode).json({
            message: err.message,
        });
    }
    else {
        GlobalErrorController.errorLogger.error(`${err}, ${enums_1.ErrorMessages.UNKNOWN_ERROR}`);
        res.status(err.statusCode).json({
            status: err.status,
            message: enums_1.ErrorMessages.UNKNOWN_ERROR,
        });
    }
};
GlobalErrorController.globalErrorController = (err, req, res, next) => {
    err.statusCode = err.statusCode || enums_1.HttpStatus.INTERNAL_SERVER_ERROR;
    err.message = err.message || enums_1.ErrorMessages.UNKNOWN_ERROR;
    switch (process.env.NODE_ENV) {
        case enums_1.NodeEnvs.DEVELOPMENT:
            GlobalErrorController.sendErrorDev(err, res);
            break;
        case enums_1.NodeEnvs.TEST:
            GlobalErrorController.sendErrorTest(err, res);
            break;
        case enums_1.NodeEnvs.PRODUCTION:
            GlobalErrorController.sendErrorProd(err, res);
            break;
    }
};
exports.default = GlobalErrorController.globalErrorController;
