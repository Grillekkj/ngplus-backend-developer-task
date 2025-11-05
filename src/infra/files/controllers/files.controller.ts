import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Delete,
  Body,
  Request,
} from '@nestjs/common';

import { JwtAccessGuard } from 'src/modules/auth/guards/jwt-access.guard';
import { FileValidationPipe } from '../pipes/validation-pipe.pipe';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { FilesService } from '../services/files.service';
import { DeleteDto } from '../dtos/delete.dto';
import { IRequest } from 'src/modules/auth/interfaces/request.struct';

@UseGuards(JwtAccessGuard, RolesGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new FileValidationPipe({
        maxByteSize: 300 * 1024 * 1024, // 300MB
        allowedMimeTypes: [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'video/mp4',
          'video/mkv',
          'video/avi',
          'audio/mpeg',
          'audio/mp3',
          'audio/wav',
        ],
        required: true,
      }),
    )
    file: Express.Multer.File,
    @Request() req: IRequest,
    @Body('folder') folder?: string,
  ): Promise<string> {
    return await this.filesService.uploadFile(file, folder, req);
  }

  @Delete('delete')
  async deleteFile(
    @Body() body: DeleteDto,
    @Request() req: IRequest,
  ): Promise<boolean> {
    return await this.filesService.deleteFile(body.fileUrl, req);
  }
}
