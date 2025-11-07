import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { Module } from '@nestjs/common';

import { ReportsModule } from './modules/reports/reports.module';
import { environment } from './common/configs/environment';
import { UsersModule } from './modules/users/users.module';
import { MediaModule } from './modules/media/media.module';
import { FilesModule } from './infra/files/files.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './infra/mail/mail.module';

const isDocker = process.env.DOCKER === 'true';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: environment.databaseConfigs.type,
      host: isDocker ? 'postgres_db' : environment.databaseConfigs.host,
      port: isDocker ? 5432 : environment.databaseConfigs.port,
      password: environment.databaseConfigs.password,
      username: environment.databaseConfigs.user,
      autoLoadEntities: true,
      database: environment.databaseConfigs.name,
      synchronize: false,
      logging: true,
    } as DataSourceOptions),
    FilesModule,
    AuthModule,
    UsersModule,
    MediaModule,
    MailModule,
    ReportsModule,
  ],
})
export class AppModule {}
