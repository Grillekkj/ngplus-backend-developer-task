import { DataSource, DataSourceOptions } from 'typeorm';
import { registerAs } from '@nestjs/config';

import { environment } from './environment';

const isDocker = process.env.DOCKER === 'true';

const databaseConfig = {
  type: environment.databaseConfigs.type,
  host: isDocker ? 'postgres_db' : environment.databaseConfigs.host,
  port: isDocker ? 5432 : environment.databaseConfigs.port,
  username: environment.databaseConfigs.user,
  password: environment.databaseConfigs.password,
  database: environment.databaseConfigs.name,
  entities: ['./src/**/*.entity{.ts,.js}'],
  migrations: ['./src/infra/database/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
} as DataSourceOptions;

export default registerAs('typeorm', () => databaseConfig);
export const connectionSource = new DataSource(databaseConfig);
