import { Module } from '@nestjs/common';

import { FilesController } from './controllers/files.controller';
import { FilesService } from './services/files.service';

@Module({
  providers: [FilesService],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}
