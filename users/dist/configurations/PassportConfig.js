"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passportConfig = exports.PassportConfig = void 0;
const passport = require("passport");
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const Dao_1 = require("../Dao");
const User_1 = require("../User");
const errorLogger_1 = require("../loggers/errorLogger");
const AppError_1 = require("../utils/AppError");
const enums_1 = require("../typization/enums");
class PassportConfig {
    constructor() {
        this.dao = Dao_1.dao;
        this.model = User_1.User;
        this.passport = passport;
        this.errorLogger = errorLogger_1.default;
        this.initialize = () => {
            return this.passport.initialize();
        };
        this.tokenExtractorFromCookie = (req) => {
            let token;
            if (req && req.cookies) {
                token = req.cookies['jwt'];
            }
            return token;
        };
        this.configure = () => {
            this.passport.use(new passport_local_1.Strategy({
                usernameField: 'email',
                passwordField: 'password',
                session: false,
            }, async (email, password, done) => {
                try {
                    let user;
                    user = await this.model.scope(enums_1.ModelScopes.WITH_SENSITIVE).findOne({ where: { email } });
                    if (!user) {
                        return done(new AppError_1.default(enums_1.HttpStatus.UNAUTHORIZED, enums_1.ErrorMessages.USERNAME_OR_PASSWORD_INCORRECT), false);
                    }
                    if (!(await user.verifyPassword(user)(password))) {
                        return done(new AppError_1.default(enums_1.HttpStatus.UNAUTHORIZED, enums_1.ErrorMessages.USERNAME_OR_PASSWORD_INCORRECT));
                    }
                    user = await this.model.findOne({
                        raw: true,
                        where: { email },
                    });
                    return done(null, { id: user.id });
                }
                catch (err) {
                    done(err);
                    this.errorLogger.error(err);
                }
            }));
            this.passport.use(new passport_jwt_1.Strategy({
                jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                    this.tokenExtractorFromCookie,
                    passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
                ]),
                secretOrKey: process.env.JWT_SECRET_KEY,
            }, async (jwt_payload, done) => {
                try {
                    const user = await this.model.findOne({
                        where: { id: jwt_payload.id },
                        raw: true,
                    });
                    if (!user) {
                        return done(new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.USER_NOT_FOUND), false);
                    }
                    return done(null, { id: user.id });
                }
                catch (err) {
                    return done(err, false);
                }
            }));
        };
        this.setSerializationForUser = () => {
            this.passport.serializeUser((user, done) => {
                done(null, user.id);
            });
            this.passport.deserializeUser(async (id, done) => {
                try {
                    const user = await this.dao.findById(id);
                    done(null, user);
                }
                catch (err) {
                    done(err);
                }
            });
        };
    }
}
exports.PassportConfig = PassportConfig;
exports.passportConfig = new PassportConfig();
