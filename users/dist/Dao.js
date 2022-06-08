"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dao = exports.Dao = void 0;
const abstractClasses_1 = require("./typization/abstractClasses");
const User_1 = require("./User");
class Dao extends abstractClasses_1.AbstractDao {
    constructor() {
        super(...arguments);
        this.userModel = User_1.User;
        this.createUser = async (data) => {
            return this.model.create(data, { fields: User_1.createUserFields });
        };
        this.getUserById = async (id) => {
            return this.findById(id);
        };
        this.editUser = async (data) => {
            const user = await this.findById(data.id);
            user.update(data, { fields: User_1.editUserFields });
        };
        this.deleteUser = async (data) => {
            const user = await this.findById(data.id);
            user.destroy();
        };
    }
    get model() {
        return this.model;
    }
}
exports.Dao = Dao;
exports.dao = new Dao();
