"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const v8_1 = require("v8");
const passport_jwt_1 = require("passport-jwt");
const Note_1 = require("../Note");
const AppError_1 = require("../utils/AppError");
const enums_1 = require("../typization/enums");
const kafka_1 = require("../kafka");
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
                    let user;
                    const kafkaSender = new kafka_1.KafkaSender();
                    const kafkaReceiver = new kafka_1.KafkaReceiver();
                    console.log('cccccccc');
                    await kafkaSender.queueUserJwt(jwt_payload);
                    console.log('dddddd');
                    let user2;
                    const fn = async (user) => {
                        user2 = Object.assign({}, user);
                    };
                    // user = await kafkaReceiver.acceptUserData(done);
                    // console.log(user2, 'userrrrrr');
                    const consumer = new kafka_1.KafkaReceiver();
                    const producer = new kafka_1.KafkaSender();
                    await consumer.consumer.connect();
                    await consumer.consumer.subscribe({ topic: 'user-data', fromBeginning: true });
                    await consumer.consumer.run({
                        eachMessage: async ({ topic, partition, message }) => {
                            console.log(v8_1.deserialize(message.value), 'valueeeeee');
                            user = v8_1.deserialize(message.value);
                            // cb(user)
                            // await this.consumer.disconnect();
                        },
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
        this.process = () => { };
    }
}
exports.default = PassportConfig;
