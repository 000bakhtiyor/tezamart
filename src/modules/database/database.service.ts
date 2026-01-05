import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import chalk from 'chalk';

export const initializeDataSource = async (configService: ConfigService): Promise<DataSourceOptions> => {

  const options: DataSourceOptions = {
    type: 'postgres',
    host: configService.get<string>('DB_HOSTNAME'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [configService.get<string>('ENTITY_PATH') || __dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get<boolean>('SYNCHRONIZE'),
    logging: configService.get<boolean>('LOGGING'),
  };

  try {
    const testDataSource = new (require('typeorm').DataSource)(options);
    await testDataSource.initialize();
    Logger.log('✅ Database connected successfully');
    await testDataSource.destroy();
  } catch (err) {
    if( err.code === "3D000") {
        Logger.error(`❌ ${chalk.bgWhite(chalk.bold(configService.get<string>('DB_NAME')))} bazasi mavjud emas. Iltimos, avval bazani yarating!`);
        process.exit(1);
    }
    Logger.error(
    `❌ ${chalk.redBright('Database connection failed')}:\n` +
    `   ${chalk.yellow(err.message)}`
    );
    process.exit(1); 
  }

  return options;
};
