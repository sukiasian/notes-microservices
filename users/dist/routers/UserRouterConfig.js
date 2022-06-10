"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport = require("passport");
const UserController_1 = require("../controllers/UserController");
const enums_1 = require("../typization/enums");
class UserRouterConfig {
    constructor() {
        this.router = express_1.Router();
        this.controller = UserController_1.userController;
        this.passport = passport;
        this.configure = () => {
            this.router.route('/').delete(this.passport.authenticate(enums_1.PassportStrategies.JWT, {
                session: false,
            }), this.controller.deleteUser);
            this.router
                .route('/:id')
                .get(this.passport.authenticate(enums_1.PassportStrategies.JWT, {
                session: false,
            }), this.controller.getUserById)
                .put(this.passport.authenticate(enums_1.PassportStrategies.JWT, {
                session: false,
            }), this.controller.editUser);
        };
    }
}
const userRouterConfig = new UserRouterConfig();
userRouterConfig.configure();
const { router: userRouter } = userRouterConfig;
exports.default = userRouter;
