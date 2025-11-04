import { DataSource, DataSourceOptions } from 'typeorm';
import { registerAs } from '@nestjs/config';

import { enviroment } from './enviroment';

const isDocker = process.env.DOCKER === 'true';

const databaseConfig = {
  type: enviroment.databaseConfigs.type,
  host: isDocker ? 'postgres_db' : enviroment.databaseConfigs.host,
  port: isDocker ? 5432 : enviroment.databaseConfigs.port,
  username: enviroment.databaseConfigs.user,
  password: enviroment.databaseConfigs.password,
  database: enviroment.databaseConfigs.name,
  entities: ['./src/**/*.entity{.ts,.js}'],
  migrations: ['./src/infra/database/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
} as DataSourceOptions;

export default registerAs('typeorm', () => databaseConfig);
export const connectionSource = new DataSource(databaseConfig);
