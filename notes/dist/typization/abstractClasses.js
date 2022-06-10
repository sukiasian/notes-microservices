"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractDao = exports.AbstractNoteController = exports.AbstractServer = exports.AbstractNoteRouterConfig = exports.AbstractPassportConfig = exports.AbstractEnvironmentConfig = exports.AbstractAppConfig = void 0;
const Note_1 = require("../Note");
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
class AbstractNoteRouterConfig extends AbstractConfig {
}
exports.AbstractNoteRouterConfig = AbstractNoteRouterConfig;
class AbstractServer {
}
exports.AbstractServer = AbstractServer;
class AbstractNoteController {
}
exports.AbstractNoteController = AbstractNoteController;
class AbstractDao {
    constructor() {
        this.findById = (id) => {
            return Note_1.Note.findOne({ where: { id } });
        };
    }
}
exports.AbstractDao = AbstractDao;
