import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UsersAdminController } from './controllers/usersAdmin.controller';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import UsersEntity from './entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UsersController, UsersAdminController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
