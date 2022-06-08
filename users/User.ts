import * as bcrypt from 'bcrypt';
import { Optional } from 'sequelize';
import { Column, Model, Table, PrimaryKey, DataType, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import { ErrorMessages, HttpStatus } from './typization/enums';
import AppError from './utils/AppError';
import { ModelScopes } from './typization/enums';

export interface UserAttributes {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    middleName?: string;
    verifyPassword?(instance: User): (password: string) => Promise<boolean>;
}
export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

const defaultScopeFieldsToExclude = ['password', 'passwordConfirmation'];
export const createUserFields: Partial<keyof UserAttributes>[] = [
    'firstName',
    'middleName',
    'lastName',
    'password',
    'passwordConfirmation',
    'email',
];
export const editUserFields: Partial<keyof UserAttributes>[] = ['firstName', 'middleName', 'lastName', 'email'];
export const editPasswordFields: Partial<keyof UserAttributes>[] = ['password', 'passwordConfirmation'];

@Table({
    timestamps: true,
    defaultScope: {
        attributes: {
            exclude: defaultScopeFieldsToExclude,
        },
    },
    scopes: {
        [ModelScopes.WITH_SENSITIVE]: {
            attributes: {
                exclude: defaultScopeFieldsToExclude,
                include: ['password'],
            },
        },
        [ModelScopes.ALL]: {
            attributes: { exclude: [] },
        },
    },
})
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    public id!: string;

    @Column({
        allowNull: false,
        validate: {
            len: {
                msg: ErrorMessages.NAMES_LENGHT_VALIDATION,
                args: [1, 25],
            },
            notNull: {
                msg: ErrorMessages.REQUIRED_FIELDS_VALIDATION,
            },
        },
    })
    public firstName: string;

    @Column({
        allowNull: false,
        validate: {
            len: {
                msg: ErrorMessages.NAMES_LENGHT_VALIDATION,
                args: [1, 25],
            },
            notNull: {
                msg: ErrorMessages.REQUIRED_FIELDS_VALIDATION,
            },
        },
    })
    public lastName: string;

    @Column({
        allowNull: false,
        validate: {
            notNull: {
                msg: ErrorMessages.REQUIRED_FIELDS_VALIDATION,
            },
            isEmail: {
                msg: ErrorMessages.EMAIL_VALIDATION,
            },
        },
        unique: {
            name: 'email',
            msg: ErrorMessages.UNIQUE_EMAIL_VALIDATION,
        },
    })
    public email: string;

    @Column({
        validate: {
            len: {
                msg: ErrorMessages.PASSWORD_LENGTH_VALIDATION,
                args: [8, 50],
            },
            comparePasswordWithPasswordConfirmation(this: User): void {
                if (this.password !== this.passwordConfirmation) {
                    throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.PASSWORDS_DO_NOT_MATCH);
                }
            },
        },
    })
    public password: string;

    @Column
    public passwordConfirmation: string;

    @Column({
        allowNull: true,
        validate: {
            len: {
                msg: ErrorMessages.NAMES_LENGHT_VALIDATION,
                args: [1, 25],
            },
        },
    })
    public middleName?: string;

    @BeforeUpdate
    @BeforeCreate
    static async hashPasswordAndRemovePasswordConfirmation(instance: User): Promise<void> {
        if (instance.password) {
            instance.password = await bcrypt.hash(instance.password, 10);
            instance.passwordConfirmation = undefined;
        }
    }

    verifyPassword(instance: User): (password: string) => Promise<boolean> {
        return async (password: string): Promise<boolean> => {
            return bcrypt.compare(password, instance.password);
        };
    }
}
