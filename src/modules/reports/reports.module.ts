import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ReportsController } from './controllers/reports.controller';
import RatingEntity from 'src/modules/media/entities/rating.entity';
import UsersEntity from 'src/modules/users/entities/users.entity';
import MediaEntity from 'src/modules/media/entities/media.entity';
import { ReportsService } from './services/reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, MediaEntity, RatingEntity])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
