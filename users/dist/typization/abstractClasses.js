"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractEnvironmentConfig = exports.AbstractDao = exports.AbstractRouter = exports.AbstractUserController = exports.AbstractAuthController = exports.AbstractServer = exports.AbstractAppConfig = void 0;
const User_1 = require("../User");
class AbstractAppConfig {
}
exports.AbstractAppConfig = AbstractAppConfig;
class AbstractServer {
}
exports.AbstractServer = AbstractServer;
class AbstractAuthController {
}
exports.AbstractAuthController = AbstractAuthController;
class AbstractUserController {
}
exports.AbstractUserController = AbstractUserController;
class AbstractRouter {
}
exports.AbstractRouter = AbstractRouter;
class AbstractDao {
    constructor() {
        this.findById = (id) => {
            return User_1.User.findOne({ where: { id } });
        };
    }
}
exports.AbstractDao = AbstractDao;
class AbstractEnvironmentConfig {
}
exports.AbstractEnvironmentConfig = AbstractEnvironmentConfig;
