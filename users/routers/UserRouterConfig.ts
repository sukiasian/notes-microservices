import { Router } from 'express';
import { PassportStatic } from 'passport';
import passport = require('passport');
import { userController, UserController } from '../controllers/UserController';
import { AbstractUserRouterConfig } from '../typization/abstractClasses';
import { PassportStrategies } from '../typization/enums';

class UserRouterConfig implements AbstractUserRouterConfig {
    public router = Router();
    private readonly controller: UserController = userController;
    private readonly passport: PassportStatic = passport;

    configure = () => {
        this.router.route('/').delete(
            this.passport.authenticate(PassportStrategies.JWT, {
                session: false,
            }),
            this.controller.deleteUser
        );

        this.router
            .route('/:id')
            .get(
                this.passport.authenticate(PassportStrategies.JWT, {
                    session: false,
                }),
                this.controller.getUserById
            )
            .put(
                this.passport.authenticate(PassportStrategies.JWT, {
                    session: false,
                }),
                this.controller.editUser
            );
    };
}

const userRouterConfig = new UserRouterConfig();

userRouterConfig.configure();

const { router: userRouter } = userRouterConfig;

export default userRouter;
