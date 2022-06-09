import * as dotenv from "dotenv";
import { AbstractEnvironmentConfig } from "../typization/abstractClasses";

export default class EnvironmentConfig implements AbstractEnvironmentConfig {
    public configure = (path: string) => {
        dotenv.config({ path });
    };
}
