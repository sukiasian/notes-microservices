"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const Dao_1 = require("../Dao");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const enums_1 = require("../typization/enums");
class AuthController {
    constructor() {
        this.dao = Dao_1.dao;
        this.utilFunctions = UtilFunctions_1.default;
        this.signupLocal = this.utilFunctions.catchAsync(async (req, res, next) => {
            const createUserData = req.body;
            const user = await this.dao.createUser(createUserData);
            return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.USER_IS_SIGNED_UP, user);
        });
        this.loginLocal = this.utilFunctions.catchAsync(async (req, res, next) => {
            const user = await this.dao.findById(req.user.id);
            await this.utilFunctions.signTokenAndStoreInCookies(res, {
                id: user.id,
            });
            return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.USER_IS_LOGGED_IN, user);
        });
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
