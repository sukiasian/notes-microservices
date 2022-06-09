import { Sequelize } from 'sequelize-typescript';
import { User } from '../User';
import { ModelScopes } from './enums';
import { CreateUserData, DeleteUserData, EditUserData } from './interfaces';

abstract class AbstractConfig {
    configure: (...props: any) => any;
}

export abstract class AbstractAppConfig extends AbstractConfig {
    app: Express.Application;
    sequelize: Sequelize;
    setupPassport: () => void;
}

export abstract class AbstractEnvironmentConfig extends AbstractConfig {}

export abstract class AbstractPassportConfig extends AbstractConfig {
    initialize: () => void;
    setSerializationForUser: () => void;
}

export abstract class AbstractAuthRouterConfig extends AbstractConfig {}

export abstract class AbstractUserRouterConfig extends AbstractConfig {}

export abstract class AbstractServer {}

export abstract class AbstractAuthController {
    signupLocal: (req, res, next) => Promise<void>;
    loginLocal: (req, res, next) => Promise<void>;
    logoutLocal: (req, res, next) => Promise<void>;
}

export abstract class AbstractUserController {
    getUserById: (req, res, next) => Promise<void>;
    editUser: (req, res, next) => Promise<void>;
    deleteUser: (req, res, next) => Promise<void>;
    getAllEmails: (req, res, next) => Promise<void>;
}

export abstract class AbstractDao {
    findById = (id: string, scope?: ModelScopes): Promise<User> => {
        return scope ? User.scope(scope).findOne({ where: { id } }) : User.findOne({ where: { id } });
    };

    createUser: (data: CreateUserData) => Promise<User>;
    getUserById: (userId: string) => Promise<User>;
    editUser: (userId: string, data: EditUserData) => Promise<void>;
    deleteUser: (data: DeleteUserData) => Promise<void>;
    getAllEmails: () => Promise<string[]>;
}
