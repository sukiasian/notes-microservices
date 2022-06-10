"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractDao = exports.AbstractUserController = exports.AbstractAuthController = exports.AbstractServer = exports.AbstractUserRouterConfig = exports.AbstractAuthRouterConfig = exports.AbstractPassportConfig = exports.AbstractEnvironmentConfig = exports.AbstractAppConfig = void 0;
const User_1 = require("../User");
class AbstractConfig {
}
class AbstractAppConfig extends AbstractConfig {
}
exports.AbstractAppConfig = AbstractAppConfig;
class AbstractEnvironmentConfig extends AbstractConfig {
}
exports.AbstractEnvironmentConfig = AbstractEnvironmentConfig;
class AbstractPassportConfig extends AbstractConfig {
}
exports.AbstractPassportConfig = AbstractPassportConfig;
class AbstractAuthRouterConfig extends AbstractConfig {
}
exports.AbstractAuthRouterConfig = AbstractAuthRouterConfig;
class AbstractUserRouterConfig extends AbstractConfig {
}
exports.AbstractUserRouterConfig = AbstractUserRouterConfig;
class AbstractServer {
}
exports.AbstractServer = AbstractServer;
class AbstractAuthController {
}
exports.AbstractAuthController = AbstractAuthController;
class AbstractUserController {
}
exports.AbstractUserController = AbstractUserController;
class AbstractDao {
    constructor() {
        this.findById = (id, scope) => {
            return scope ? User_1.User.scope(scope).findOne({ where: { id } }) : User_1.User.findOne({ where: { id } });
        };
    }
}
exports.AbstractDao = AbstractDao;
