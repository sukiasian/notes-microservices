import { dao } from '../Dao';
import { AbstractUserController } from '../typization/abstractClasses';
import { ErrorMessages, HttpStatus, ModelScopes, ResponseMessages } from '../typization/enums';
import { DeleteUserData, EditUserData } from '../typization/interfaces';
import AppError from '../utils/AppError';
import UtilFunctions from '../utils/UtilFunctions';

export class UserController implements AbstractUserController {
    private readonly dao = dao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public getUserById = this.utilFunctions.catchAsync(async (req, res, next) => {
        const user = await this.dao.getUserById(req.params.id);

        return this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, user);
    });

    public editUser = this.utilFunctions.catchAsync(async (req, res, next) => {
        const editUserData = req.body as EditUserData;

        await this.dao.editUser(req.user.id, editUserData);

        return this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.USER_DATA_IS_CHANGED, null);
    });

    public deleteUser = this.utilFunctions.catchAsync(async (req, res, next) => {
        const password = (req.body as DeleteUserData).password;
        const user = await this.dao.findById(req.user.id, ModelScopes.WITH_SENSITIVE);

        const passwordIsCorrect = await user.verifyPassword(user)(password);

        if (!passwordIsCorrect) {
            throw new AppError(HttpStatus.FORBIDDEN, ResponseMessages.INCORRECT_PASSWORD);
        }

        await user.destroy();

        return this.utilFunctions.sendResponse(res)(HttpStatus.OK, ErrorMessages.USER_IS_DELETED, null);
    });

    public getAllEmails = this.utilFunctions.catchAsync(async (req, res, next) => {
        const emails = await this.dao.getAllEmails();

        return this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, emails);
    });

    public checkIfUserIsValid = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const user = await this.dao.findById(id);
        const userExists = user ? true : false;

        return userExists
            ? this.utilFunctions.sendResponse(res)(
                  HttpStatus.OK,
                  user ? ResponseMessages.USER_EXISTS : ResponseMessages.USER_DOES_NOT_EXIST
              )
            : this.utilFunctions.sendResponse(res)(HttpStatus.NOT_FOUND, ResponseMessages.USER_DOES_NOT_EXIST);
    });
}

export const userController = new UserController();
