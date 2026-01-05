import { Logger } from '@nestjs/common';
import Joi, * as joi from 'joi';
import { IConfig } from './interfaces/joi.interface';

const appConfigSchema = joi.object({
    PORT: joi.number().default(3000),
    HOST: joi.string().default('localhost'),
});

const psqlConfigSchema = joi.object({
    DB_HOSTNAME: joi.string().required(),
    DB_PORT: joi.number().default(5432),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    SYNCHRONIZE: joi.boolean().default(false),
    LOGGING: joi.boolean().default(true),
    ENTITY_PATH: joi.string().required(),
})

const configSchema = appConfigSchema
.concat(psqlConfigSchema);

const joiConfigOptions = {
    abortEarly: false,
    allowUnknown: true,
};

export const validateEnv = (config: Record<string, unknown>): IConfig => {

  const { error, value } = configSchema.validate(config, joiConfigOptions);

  if (error) {
    Logger.log('❌ .env faylda bo\'lishi kerak bo\'lgan o\'zgaruvchilar:');
    error.details.forEach((d) => {
      Logger.error(`------ ${d.message.replace("is required", "bo'lishi shart")}`);
    });
    Logger.log('Iltimos, .env faylini to\'g\'ri to\'ldiring va qaytadan ishga tushiring!');
    process.exit(1);
  }

  return value as IConfig;
};