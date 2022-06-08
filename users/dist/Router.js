"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("./controllers/AuthController");
const UserController_1 = require("./controllers/UserController");
class RouterConfig {
    constructor() {
        this.router = express_1.Router();
        this.authController = AuthController_1.authController;
        this.userController = UserController_1.userController;
        this.prepareRouter = () => {
            this.router.post("/signup", this.authController.signupLocal);
            this.router.post("/login", this.authController.loginLocal);
            this.router.get("/:id", this.userController.getUserById);
            this.router.put("/:id", this.userController.editUser);
            this.router.put("/:id/password", this.userController.editUser);
            this.router.delete("/:id", this.userController.deleteUser);
        };
    }
}
const routerConfig = new RouterConfig();
routerConfig.prepareRouter();
const { router } = routerConfig;
exports.default = router;
