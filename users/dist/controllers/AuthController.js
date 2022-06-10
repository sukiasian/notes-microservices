"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const Dao_1 = require("../Dao");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const enums_1 = require("../typization/enums");
const AppError_1 = require("../utils/AppError");
const kafka_1 = require("../kafka");
class AuthController {
    constructor() {
        this.dao = Dao_1.dao;
        this.utilFunctions = UtilFunctions_1.default;
        this.kafkaSender = new kafka_1.KafkaSender();
        this.signupLocal = this.utilFunctions.catchAsync(async (req, res, next) => {
            const createUserData = req.body;
            const user = await this.dao.createUser(createUserData);
            await this.utilFunctions.signTokenAndStoreInCookies(res, {
                id: user.id,
            });
            await this.kafkaSender.queueNewUserEmail(user.email);
            return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.CREATED, enums_1.ResponseMessages.USER_IS_SIGNED_UP, user);
        });
        this.loginLocal = this.utilFunctions.catchAsync(async (req, res, next) => {
            const user = await this.dao.findById(req.user.id);
            await this.utilFunctions.signTokenAndStoreInCookies(res, {
                id: user.id,
            });
            return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.USER_IS_LOGGED_IN, user);
        });
        this.logoutLocal = this.utilFunctions.catchAsync(async (req, res, next) => {
            const cookie = req.cookies['jwt'];
            if (cookie) {
                res.clearCookie('jwt');
                return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.USER_IS_LOGGED_OUT);
            }
            throw new AppError_1.default(enums_1.HttpStatus.UNAUTHORIZED, enums_1.ErrorMessages.NOT_AUTHORIZED);
        });
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
