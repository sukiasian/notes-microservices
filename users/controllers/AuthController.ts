import { Dao, dao } from '../Dao';
import UtilFunctions from '../utils/UtilFunctions';
import { AbstractAuthController } from '../typization/abstractClasses';
import { ErrorMessages, HttpStatus, ResponseMessages } from '../typization/enums';
import { CreateUserData } from '../typization/interfaces';
import AppError from '../utils/AppError';

export class AuthController implements AbstractAuthController {
    private readonly dao: Dao = dao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    signupLocal = this.utilFunctions.catchAsync(async (req, res, next) => {
        const createUserData = req.body as CreateUserData;
        const user = await this.dao.createUser(createUserData);

        await this.utilFunctions.signTokenAndStoreInCookies(res, {
            id: user.id,
        });

        this.utilFunctions.sendResponse(res)(HttpStatus.CREATED, ResponseMessages.USER_IS_SIGNED_UP, user);
    });

    loginLocal = this.utilFunctions.catchAsync(async (req, res, next) => {
        const user = await this.dao.findById(req.user.id);

        await this.utilFunctions.signTokenAndStoreInCookies(res, {
            id: user.id,
        });

        return this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.USER_IS_LOGGED_IN, user);
    });

    logoutLocal = this.utilFunctions.catchAsync(async (req, res, next) => {
        const cookie = req.cookies['jwt'];

        if (cookie) {
            res.clearCookie('jwt');

            return this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.USER_IS_LOGGED_OUT);
        }

        throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.NOT_AUTHORIZED);
    });
}

export const authController = new AuthController();
