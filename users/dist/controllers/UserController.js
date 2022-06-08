"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const Dao_1 = require("../Dao");
const UtilFunctions_1 = require("../utils/UtilFunctions");
class UserController {
    constructor() {
        this.dao = Dao_1.dao;
        this.utilFunctions = UtilFunctions_1.default;
        this.getUserById = this.utilFunctions.catchAsync(async (req, res, next) => { });
        this.editUser = this.utilFunctions.catchAsync(async (req, res, next) => { });
        this.deleteUser = this.utilFunctions.catchAsync(async (req, res, next) => { });
        this.editUserPassword = this.utilFunctions.catchAsync(async (req, res, next) => { });
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
