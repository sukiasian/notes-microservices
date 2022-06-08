import * as passport from "passport";
import * as express from "express";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt, JwtFromRequestFunction } from "passport-jwt";
import { Logger } from "winston";
import { dao, Dao } from "../Dao";
import { User } from "../User";
import errorLogger from "../loggers/errorLogger";
import AppError from "../utils/AppError";
import { AbstractPassportConfig } from "../typization/abstractClasses";
import { ErrorMessages, HttpStatus, ModelScopes } from "../typization/enums";

export class PassportConfig implements AbstractPassportConfig {
    private readonly dao: Dao = dao;
    private readonly model: typeof User = User;
    private passport: passport.PassportStatic = passport;
    private readonly errorLogger: Logger = errorLogger;

    public initialize = (): express.Handler => {
        return this.passport.initialize();
    };

    private tokenExtractorFromCookie: JwtFromRequestFunction = (req) => {
        let token: string;

        if (req && req.cookies) {
            token = req.cookies["jwt"];
        }

        return token;
    };

    public configure = (): void => {
        this.passport.use(
            new LocalStrategy(
                {
                    usernameField: "email",
                    passwordField: "password",
                    session: false,
                },
                async (email, password, done) => {
                    try {
                        let user: User;

                        user = await this.model
                            .scope(ModelScopes.WITH_SENSITIVE)
                            .findOne({ where: { email } });

                        if (!user) {
                            return done(
                                new AppError(
                                    HttpStatus.UNAUTHORIZED,
                                    ErrorMessages.USERNAME_OR_PASSWORD_INCORRECT
                                ),
                                false
                            );
                        }

                        if (!(await user.verifyPassword(user)(password))) {
                            return done(
                                new AppError(
                                    HttpStatus.UNAUTHORIZED,
                                    ErrorMessages.USERNAME_OR_PASSWORD_INCORRECT
                                )
                            );
                        }

                        user = await this.model.findOne({
                            raw: true,
                            where: { email },
                        });

                        return done(null, { id: user.id });
                    } catch (err) {
                        done(err);
                        this.errorLogger.error(err);
                    }
                }
            )
        );

        this.passport.use(
            new JwtStrategy(
                {
                    jwtFromRequest: ExtractJwt.fromExtractors([
                        this.tokenExtractorFromCookie,
                        ExtractJwt.fromAuthHeaderAsBearerToken(),
                    ]),
                    secretOrKey: process.env.JWT_SECRET_KEY,
                },
                async (jwt_payload, done) => {
                    try {
                        const user = await this.model.findOne({
                            where: { id: jwt_payload.id },
                            raw: true,
                        });

                        if (!user) {
                            return done(
                                new AppError(
                                    HttpStatus.FORBIDDEN,
                                    ErrorMessages.USER_NOT_FOUND
                                ),
                                false
                            );
                        }

                        return done(null, { id: user.id });
                    } catch (err) {
                        return done(err, false);
                    }
                }
            )
        );
    };

    public setSerializationForUser = () => {
        this.passport.serializeUser((user: User, done: Function) => {
            done(null, user.id);
        });

        this.passport.deserializeUser(async (id: string, done: Function) => {
            try {
                const user = await this.dao.findById(id as string);

                done(null, user);
            } catch (err) {
                done(err);
            }
        });
    };
}

export const passportConfig = new PassportConfig();
