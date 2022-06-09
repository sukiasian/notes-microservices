import * as express from 'express';
import { Note } from './Note';
import { Sequelize } from 'sequelize-typescript';
import { AbstractAppConfig } from './typization/abstractClasses';
import globalErrorController from './controllers/GlobalErrorController';
import { Routes } from './typization/enums';
import PassportConfig from './configurations/PassportConfig';
import NoteRouterConfig from './RouterConfig';

const routerConfig = new NoteRouterConfig();
routerConfig.configure();

const passportConfig = new PassportConfig();

export default class AppConfig implements AbstractAppConfig {
    private readonly passportConfig: PassportConfig = passportConfig;
    public readonly app: express.Application = express();
    public readonly sequelize: Sequelize = new Sequelize({
        dialect: 'postgres',
        dialectOptions: {
            multipleStatements: true,
        },
        host: process.env.POSTGRES_HOST || 'postgres',
        port: Number.parseInt(process.env.POSTGRES_PORT, 10) || 5432,
        username: process.env.USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        models: [Note],
        logging: false,
    });
    private readonly router: express.Router = routerConfig.router;

    public setupPassport = () => {
        this.passportConfig.configure();
    };

    public configure = (): void => {
        this.app.use(express.json({ limit: '10Kb' }));
        // this.app.use(cookieParser());
        this.app.use(this.passportConfig.initialize());
        this.app.use(Routes.NOTES, this.router);
        this.app.use(globalErrorController);
    };
}
