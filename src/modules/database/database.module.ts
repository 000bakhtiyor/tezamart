import { Global, Module } from '@nestjs/common';
import { initializeDataSource } from './database.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: initializeDataSource,
            inject: [ConfigService],
        }),
    ]
})
export class DatabaseModule {}
