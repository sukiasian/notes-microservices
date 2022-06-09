import * as passport from 'passport';
import * as express from 'express';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt, JwtFromRequestFunction } from 'passport-jwt';
import { Note } from '../Note';
import AppError from '../utils/AppError';
import { AbstractPassportConfig } from '../typization/abstractClasses';
import { ErrorMessages, HttpStatus } from '../typization/enums';

export default class PassportConfig implements AbstractPassportConfig {
    private readonly model: typeof Note = Note;
    private passport: passport.PassportStatic = passport;

    public initialize = (): express.Handler => {
        return this.passport.initialize();
    };

    private tokenExtractorFromCookie: JwtFromRequestFunction = (req) => {
        let token: string;

        if (req && req.cookies) {
            token = req.cookies['jwt'];
        }

        return token;
    };

    public configure = (): void => {
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
                            return done(new AppError(HttpStatus.FORBIDDEN, ErrorMessages.USER_NOT_FOUND), false);
                        }

                        return done(null, { id: user.id });
                    } catch (err) {
                        return done(err, false);
                    }
                }
            )
        );
    };
}
