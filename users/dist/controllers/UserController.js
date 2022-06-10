"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const Dao_1 = require("../Dao");
const enums_1 = require("../typization/enums");
const AppError_1 = require("../utils/AppError");
const UtilFunctions_1 = require("../utils/UtilFunctions");
class UserController {
    constructor() {
        this.dao = Dao_1.dao;
        this.utilFunctions = UtilFunctions_1.default;
        this.getUserById = this.utilFunctions.catchAsync(async (req, res, next) => {
            const user = await this.dao.getUserById(req.params.id);
            return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, user);
        });
        this.editUser = this.utilFunctions.catchAsync(async (req, res, next) => {
            const editUserData = req.body;
            await this.dao.editUser(req.user.id, editUserData);
            return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.USER_DATA_IS_CHANGED, null);
        });
        this.deleteUser = this.utilFunctions.catchAsync(async (req, res, next) => {
            const password = req.body.password;
            const user = await this.dao.findById(req.user.id, enums_1.ModelScopes.WITH_SENSITIVE);
            const passwordIsCorrect = await user.verifyPassword(user)(password);
            if (!passwordIsCorrect) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ResponseMessages.INCORRECT_PASSWORD);
            }
            await user.destroy();
            return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ErrorMessages.USER_IS_DELETED, null);
        });
        this.getAllEmails = this.utilFunctions.catchAsync(async (req, res, next) => {
            const emails = await this.dao.getAllEmails();
            return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, emails);
        });
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
