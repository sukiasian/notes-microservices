import { AbstractDao } from './typization/abstractClasses';
import { CreateUserData, DeleteUserData, EditUserData } from './typization/interfaces';
import { createUserFields, editUserFields, User } from './User';

export class Dao extends AbstractDao implements AbstractDao {
    userModel = User;

    get model(): typeof User {
        return this.userModel;
    }

    public createUser = async (data: CreateUserData) => {
        return await User.create(data, {
            fields: createUserFields,
        });
    };

    public getUserById = async (id: string) => {
        return this.findById(id);
    };

    public editUser = async (userId: string, data: EditUserData) => {
        const user = await this.findById(userId);

        await user.update(data, { fields: editUserFields });
    };

    public deleteUser = async (data: DeleteUserData) => {
        const user = await this.findById(data.id);

        user.destroy();
    };

    public getAllEmails = async () => {
        const users = await this.model.findAll();
        let emails: string[];

        users.forEach((user) => {
            emails.push(user.email);
        });

        return emails;
    };
}

export const dao = new Dao();
