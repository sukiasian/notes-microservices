import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { Logger } from "winston";
import errorLogger from "../loggers/errorLogger";
import { ErrorMessages, HttpStatus, NodeEnvs } from "../typization/enums";

class GlobalErrorController {
    private static readonly errorLogger: Logger = errorLogger;

    private static sendErrorProd = (err: any, res: Response): void => {
        if (err.isOperational) {
            GlobalErrorController.errorLogger.error(
                `${err}, ${ErrorMessages.APPLICATION_ERROR}`
            );

            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        } else {
            GlobalErrorController.errorLogger.error(
                `${err}, ${ErrorMessages.UNKNOWN_ERROR}`
            );

            res.status(err.statusCode).json({
                status: err.status,
                message: ErrorMessages.UNKNOWN_ERROR,
            });
        }
    };
    private static sendErrorDev = (err: any, res: Response): void => {
        GlobalErrorController.errorLogger.error(`${err}`);

        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    };
    private static sendErrorTest = (err: any, res: Response): void => {
        if (err.isOperational) {
            GlobalErrorController.errorLogger.error(
                `${err}, ${ErrorMessages.APPLICATION_ERROR}`
            );

            res.status(err.statusCode).json({
                message: err.message,
            });
        } else {
            GlobalErrorController.errorLogger.error(
                `${err}, ${ErrorMessages.UNKNOWN_ERROR}`
            );

            res.status(err.statusCode).json({
                status: err.status,
                message: ErrorMessages.UNKNOWN_ERROR,
            });
        }
    };

    public static globalErrorController: ErrorRequestHandler = (
        err: any,
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        err.statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        err.message = err.message || ErrorMessages.UNKNOWN_ERROR;

        switch (process.env.NODE_ENV) {
            case NodeEnvs.DEVELOPMENT:
                GlobalErrorController.sendErrorDev(err, res);
                break;

            case NodeEnvs.TEST:
                GlobalErrorController.sendErrorTest(err, res);
                break;

            case NodeEnvs.PRODUCTION:
                GlobalErrorController.sendErrorProd(err, res);
                break;
        }
    };
}

export default GlobalErrorController.globalErrorController;
