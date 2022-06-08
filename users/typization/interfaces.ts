import { UserCreationAttributes } from '../User';

export interface CreateUserData extends Omit<UserCreationAttributes, 'verifyPassword'> {}

export interface LoginUserData {
    email: string;
    password: string;
}

export interface EditUserData {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email?: string;
}

export interface EditUserPasswordData {
    password: string;
    passwordConfirmation: string;
    id?: string;
}

export interface DeleteUserData {
    password: string;
    id?: string;
}
