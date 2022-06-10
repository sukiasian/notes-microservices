import * as passport from 'passport';
import * as express from 'express';
import { serialize, deserialize } from 'v8';
import { Strategy as JwtStrategy, ExtractJwt, JwtFromRequestFunction } from 'passport-jwt';
import { Note } from '../Note';
import AppError from '../utils/AppError';
import { AbstractPassportConfig } from '../typization/abstractClasses';
import { ErrorMessages, HttpStatus } from '../typization/enums';
import { KafkaReceiver, KafkaSender } from '../kafka';

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
                        let user;

                        const kafkaSender = new KafkaSender();
                        const kafkaReceiver = new KafkaReceiver();
                        console.log('cccccccc');

                        await kafkaSender.queueUserJwt(jwt_payload);
                        console.log('dddddd');

                        let user2;

                        const fn = async (user) => {
                            user2 = { ...user };
                        };

                        // user = await kafkaReceiver.acceptUserData(done);

                        // console.log(user2, 'userrrrrr');
                        const consumer = new KafkaReceiver();
                        const producer = new KafkaSender();

                        await consumer.consumer.connect();
                        await consumer.consumer.subscribe({ topic: 'user-data', fromBeginning: true });

                        await consumer.consumer.run({
                            eachMessage: async ({ topic, partition, message }) => {
                                console.log(deserialize(message.value), 'valueeeeee');
                                user = deserialize(message.value);

                                // cb(user)
                                // await this.consumer.disconnect();
                            },
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

    process = () => {};
}
