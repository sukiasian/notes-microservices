import { CookieOptions, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { Sequelize } from 'sequelize-typescript';
import errorLogger from '../loggers/errorLogger';
import informationalLogger from '../loggers/informationalLogger';
import { HttpStatus, NodeEnvs, ResponseMessages, ResponseStatus } from '../typization/enums';

export default class UtilFunctions {
    private static readonly informationalLogger = informationalLogger;
    private static readonly errorLogger = errorLogger;
    private static signToken = jwt.sign;

    public static catchAsync = (fn: (...props: any) => any) => {
        return (req, res, next): any => {
            fn(req, res, next).catch(next);
        };
    };

    public static defineResponseStatus = (httpStatus: number): ResponseStatus => {
        if (httpStatus >= HttpStatus.OK && httpStatus < HttpStatus.FORBIDDEN) {
            return ResponseStatus.SUCCESS;
        } else if (httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR) {
            return ResponseStatus.ERROR;
        }

        return ResponseStatus.FAILURE;
    };

    public static signTokenAndStoreInCookies = async (
        res: Response,
        jwtPayload: object,
        signOptions: SignOptions = {}
    ): Promise<void> => {
        const token = UtilFunctions.signToken(jwtPayload, process.env.JWT_SECRET_KEY, signOptions);
        const cookieOptions: CookieOptions = {
            httpOnly: true,
            expires: new Date(Date.now() + 90 * 24 * 3600000),
            secure: false,
        };

        if (process.env.NODE_ENV === NodeEnvs.PRODUCTION) {
            cookieOptions.secure = true;
        }

        res.cookie('jwt', token, cookieOptions);
    };

    public static sendResponse = (
        res: Response
    ): ((statusCode: HttpStatus, message?: ResponseMessages | string, data?: any) => void) => {
        return (statusCode: HttpStatus, message?: string, data?: any): void => {
            if (!message && data) {
                res.status(statusCode).json({
                    status: UtilFunctions.defineResponseStatus(statusCode),
                    data,
                });
            } else if (message && data !== undefined) {
                res.status(statusCode).json({
                    status: UtilFunctions.defineResponseStatus(statusCode),
                    message,
                    data,
                });
            } else if (message && data === undefined) {
                res.status(statusCode).json({
                    status: UtilFunctions.defineResponseStatus(statusCode),
                    message,
                });
            } else {
                res.status(statusCode).json({
                    status: UtilFunctions.defineResponseStatus(statusCode),
                });
            }
        };
    };

    public static exitHandler = (server: any, sequelize: Sequelize) => {
        process
            .on('unhandledRejection', (reason, p) => {
                console.error(reason, 'Unhandled Rejection at Promise', p);

                server.close((err: any) => {
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
                server.close((err: any) => {
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
                server.close((err: any) => {
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
                server.close((err: any) => {
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
}
