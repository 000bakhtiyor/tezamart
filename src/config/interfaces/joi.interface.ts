export interface IConfig {
    APP: IAppConfig;
    DATABASE: IDatabaseConfig;
}

interface IDatabaseConfig {
    DB_HOSTNAME: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    SYNCHRONIZE: boolean;
    LOGGING: boolean;
    ENTITY_PATH: string;
}
interface IAppConfig {
    PORT: number;
    HOST: string;
}
