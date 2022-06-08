import { AbstractDao } from './typization/abstractClasses';
import { CreateUserData, DeleteUserData, EditUserData } from './typization/interfaces';
import { createUserFields, editUserFields, User } from './User';

export class Dao extends AbstractDao implements AbstractDao {
    userModel = User;

    get model(): typeof User {
        return this.userModel;
    }

    createUser = async (data: CreateUserData) => {
        return this.model.create(data, {
            fields: createUserFields,
        });
    };

    getUserById = async (id: string) => {
        return this.findById(id);
    };

    editUser = async (userId: string, data: EditUserData) => {
        const user = await this.findById(userId);

        await user.update(data, { fields: editUserFields });
    };

    deleteUser = async (data: DeleteUserData) => {
        const user = await this.findById(data.id);

        user.destroy();
    };
}

export const dao = new Dao();
