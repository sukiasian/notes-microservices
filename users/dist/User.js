"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.editPasswordFields = exports.editUserFields = exports.createUserFields = void 0;
const bcrypt = require("bcrypt");
const sequelize_typescript_1 = require("sequelize-typescript");
const enums_1 = require("./typization/enums");
const AppError_1 = require("./utils/AppError");
const enums_2 = require("./typization/enums");
const defaultScopeFieldsToExclude = ["password", "passwordConfirmation"];
exports.createUserFields = [
    "firstName",
    "middleName",
    "lastName",
    "password",
    "passwordConfirmation",
    "email",
];
exports.editUserFields = [
    "firstName",
    "middleName",
    "lastName",
    "email",
];
exports.editPasswordFields = [
    "password",
    "passwordConfirmation",
];
let User = class User extends sequelize_typescript_1.Model {
    static async hashPasswordAndRemovePasswordConfirmation(instance) {
        if (instance.password) {
            instance.password = await bcrypt.hash(instance.password, 10);
            instance.passwordConfirmation = undefined;
        }
    }
    verifyPassword(instance) {
        return async (password) => {
            return bcrypt.compare(password, instance.password);
        };
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        validate: {
            len: {
                msg: enums_1.ErrorMessages.NAMES_LENGHT_VALIDATION,
                args: [2, 25],
            },
            notNull: {
                msg: enums_1.ErrorMessages.REQUIRED_FIELDS_VALIDATION,
            },
        },
    }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        validate: {
            len: {
                msg: enums_1.ErrorMessages.NAMES_LENGHT_VALIDATION,
                args: [2, 25],
            },
            notNull: {
                msg: enums_1.ErrorMessages.REQUIRED_FIELDS_VALIDATION,
            },
        },
    }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        validate: {
            notNull: {
                msg: enums_1.ErrorMessages.REQUIRED_FIELDS_VALIDATION,
            },
            isEmail: {
                msg: enums_1.ErrorMessages.EMAIL_VALIDATION,
            },
        },
        unique: {
            name: "email",
            msg: enums_1.ErrorMessages.UNIQUE_EMAIL_VALIDATION,
        },
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.Column({
        validate: {
            len: {
                msg: enums_1.ErrorMessages.PASSWORD_LENGTH_VALIDATION,
                args: [8, 50],
            },
            comparePasswordWithPasswordConfirmation() {
                if (this.password !== this.passwordConfirmation) {
                    throw new AppError_1.default(enums_1.HttpStatus.BAD_REQUEST, enums_1.ErrorMessages.PASSWORDS_DO_NOT_MATCH);
                }
            },
        },
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "passwordConfirmation", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
        validate: {
            len: {
                msg: enums_1.ErrorMessages.NAMES_LENGHT_VALIDATION,
                args: [5, 25],
            },
        },
    }),
    __metadata("design:type", String)
], User.prototype, "middleName", void 0);
__decorate([
    sequelize_typescript_1.BeforeUpdate,
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "hashPasswordAndRemovePasswordConfirmation", null);
User = __decorate([
    sequelize_typescript_1.Table({
        timestamps: true,
        defaultScope: {
            attributes: {
                exclude: defaultScopeFieldsToExclude,
            },
        },
        scopes: {
            [enums_2.ModelScopes.WITH_SENSITIVE]: {
                attributes: {
                    exclude: defaultScopeFieldsToExclude,
                    include: ["password"],
                },
            },
            [enums_2.ModelScopes.ALL]: {
                attributes: { exclude: [] },
            },
        },
    })
], User);
exports.User = User;
