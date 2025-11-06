import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { RatingsController } from './controllers/ratings.controller';
import { MediaController } from './controllers/media.controller';
import { RatingsService } from './services/ratings.service';
import { MediaService } from './services/media.service';
import RatingEntity from './entities/rating.entity';
import MediaEntity from './entities/media.entity';
@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity, RatingEntity])],
  controllers: [MediaController, RatingsController],
  providers: [MediaService, RatingsService],
})
export class MediaModule {}
