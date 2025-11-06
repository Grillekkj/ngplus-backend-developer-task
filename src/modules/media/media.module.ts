import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import RatingEntity from './entities/rating.entity';
import MediaEntity from './entities/media.entity';

// Services
import { MediaService } from './services/media.service';
import { RatingsService } from './services/ratings.service';

// Controllers
import { MediaController } from './controllers/media.controller';
import { RatingsController } from './controllers/ratings.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaEntity, RatingEntity]),
    UsersModule, // Importar UsersModule para ter acesso ao UsersService
  ],
  controllers: [
    MediaController, // Controlador de Mídia (com permissões no service)
    RatingsController, // Controlador de Ratings (com permissões no service)
  ],
  providers: [
    MediaService, // Serviço de Mídia
    RatingsService, // Serviço de Ratings
  ],
})
export class MediaModule {}
