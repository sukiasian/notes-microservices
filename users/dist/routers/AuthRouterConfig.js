"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const enums_1 = require("../typization/enums");
class AuthRouterConfig {
    constructor() {
        this.router = express_1.Router();
        this.controller = AuthController_1.authController;
        this.passport = passport;
        this.configure = () => {
            this.router.post('/signup', this.controller.signupLocal);
            this.router.post('/login', this.passport.authenticate(enums_1.PassportStrategies.LOCAL, {
                session: false,
            }), this.controller.loginLocal);
            this.router.get('/logout', this.controller.logoutLocal);
        };
    }
}
const authRouterConfig = new AuthRouterConfig();
authRouterConfig.configure();
const authRouter = authRouterConfig.router;
exports.default = authRouter;
