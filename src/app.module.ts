import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { Module } from '@nestjs/common';

import { enviroment } from './common/configs/enviroment';
import { FilesModule } from './infra/files/files.module';

const isDocker = process.env.DOCKER === 'true';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: enviroment.databaseConfigs.type,
      host: isDocker ? 'postgres_db' : enviroment.databaseConfigs.host,
      port: isDocker ? 5432 : enviroment.databaseConfigs.port,
      password: enviroment.databaseConfigs.password,
      username: enviroment.databaseConfigs.user,
      autoLoadEntities: true,
      database: enviroment.databaseConfigs.name,
      synchronize: false,
      logging: true,
    } as DataSourceOptions),
    FilesModule,
  ],
})
export class AppModule {}
