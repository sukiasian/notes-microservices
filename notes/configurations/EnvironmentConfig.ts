import * as dotenv from 'dotenv';
import { AbstractEnvironmentConfig } from '../typization/abstractClasses';
import { NodeEnvs } from '../typization/enums';

export default class EnvironmentConfig implements AbstractEnvironmentConfig {
    public configure = () => {
        dotenv.config({ path: process.env.NODE_ENV === NodeEnvs.TEST ? './.env.test' : './.env' });
    };
}
