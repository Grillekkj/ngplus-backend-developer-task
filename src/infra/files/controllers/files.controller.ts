import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
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
import { IRequest } from 'src/modules/auth/interfaces/request.struct';
import { FileValidationPipe } from '../pipes/validation-pipe.pipe';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { FilesService } from '../services/files.service';
import { DeleteDto } from '../dtos/delete.dto';

@ApiTags('Files')
@UseGuards(JwtAccessGuard, RolesGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload a file',
    description:
      'Uploads a file to the configured S3 bucket. Admins can choose a folder; regular users upload to their own folder. Supports images, videos, executables, compressed archives and audio files. Max size: 1GB.',
  })
  @ApiBearerAuth('access-token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folder: {
          type: 'string',
          description:
            'Optional folder. Only used by admin; ignored for regular users.',
          example: 'misc',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      type: 'string',
      example: 'https://s3.example.com/mybucket/username/file-uuid.jpg',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file (wrong type, too large, missing)',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Invalid file.' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error while uploading',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Failed to upload file to S3.' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async uploadFile(
    @UploadedFile(
      new FileValidationPipe({
        maxByteSize: 1024 * 1024 * 1024, // 1GB
        allowedMimeTypes: [
          // Images
          'image/jpeg',
          'image/png',
          'image/jpg',

          // Videos
          'video/mp4',
          'video/mkv',
          'video/avi',

          // Audio
          'audio/mpeg',
          'audio/mp3',
          'audio/wav',

          // Compressed files
          'application/zip',
          'application/x-zip-compressed',
          'application/x-rar-compressed',
          'application/x-7z-compressed',
          'application/x-tar',
          'application/gzip',

          // Executables
          'application/x-msdownload',
          'application/octet-stream',
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
  @ApiOperation({
    summary: 'Delete a file',
    description:
      'Deletes a file from S3 based on the file URL. Users can only delete their own files unless they are admin.',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
    schema: { type: 'boolean', example: true },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file URL',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Invalid file URL.' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: attempting to delete another user’s file',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: {
          type: 'string',
          example: 'You can only delete files in your own folder.',
        },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error while deleting file',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Failed to delete file from S3.' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async deleteFile(
    @Body() body: DeleteDto,
    @Request() req: IRequest,
  ): Promise<boolean> {
    return await this.filesService.deleteFile(body.fileUrl, req);
  }
}
