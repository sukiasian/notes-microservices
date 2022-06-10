"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const passport_jwt_1 = require("passport-jwt");
const Note_1 = require("../Note");
const AppError_1 = require("../utils/AppError");
const enums_1 = require("../typization/enums");
const axios_1 = require("axios");
class PassportConfig {
    constructor() {
        this.model = Note_1.Note;
        this.passport = passport;
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
            this.passport.use(new passport_jwt_1.Strategy({
                jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                    this.tokenExtractorFromCookie,
                    passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
                ]),
                secretOrKey: process.env.JWT_SECRET_KEY,
            }, async (jwt_payload, done) => {
                try {
                    const userIsValidRes = await axios_1.default.get(`http://users:8000/api/v1/users/isValid/${jwt_payload.id}`);
                    console.log(userIsValidRes);
                    if (!userIsValidRes.data) {
                        return done(new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.USER_NOT_FOUND), false);
                    }
                    return done(null, { id: jwt_payload.id });
                }
                catch (err) {
                    return done(err, false);
                }
            }));
        };
    }
}
exports.default = PassportConfig;
