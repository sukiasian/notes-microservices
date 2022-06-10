import * as passport from 'passport';
import { Router } from 'express';
import { authController, AuthController } from '../controllers/AuthController';
import { PassportStrategies } from '../typization/enums';
import { AbstractAuthRouterConfig } from '../typization/abstractClasses';

class AuthRouterConfig implements AbstractAuthRouterConfig {
    public router: Router = Router();
    private readonly controller: AuthController = authController;
    private readonly passport: passport.PassportStatic = passport;

    configure = () => {
        this.router.post('/signup', this.controller.signupLocal);

        this.router.post(
            '/login',
            this.passport.authenticate(PassportStrategies.LOCAL, {
                session: false,
            }),
            this.controller.loginLocal
        );

        this.router.get('/logout', this.controller.logoutLocal);
    };
}

const authRouterConfig = new AuthRouterConfig();

authRouterConfig.configure();

const authRouter = authRouterConfig.router;

export default authRouter;
