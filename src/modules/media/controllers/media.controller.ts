import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Put,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';

import { IReturnPaginatedMedia } from '../interfaces/media-returnPaginated.struct';
import { JwtAccessGuard } from 'src/modules/auth/guards/jwt-access.guard';
import { AccountType } from 'src/modules/users/enums/account-type.enum';
import { IRequest } from 'src/modules/auth/interfaces/request.struct';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { FindAllMediaDto } from '../dtos/media-findAll.dto';
import { FindOneMediaDto } from '../dtos/media-findOne.dto';
import { CreateMediaDto } from '../dtos/media-create.dto';
import { UpdateMediaDto } from '../dtos/media-update.dto';
import { RemoveMediaDto } from '../dtos/media-remove.dto';
import { MediaService } from '../services/media.service';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.USER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create new media',
    description:
      'Creates a new media entry linked to the authenticated user. Only USER or ADMIN roles are allowed.',
  })
  @ApiResponse({
    status: 201,
    description: 'Media created successfully.',
    schema: {
      example: {
        id: 'uuid',
        title: 'Example title',
        description: 'Example description',
        thumbnailUrl: 'https://example.com/thumb.png',
        contentUrl: 'https://example.com/content.mp4',
        mediaCategory: 'GAME',
        userId: 'uuid',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() body: CreateMediaDto, @Req() req: IRequest) {
    const userId = req.user?.userId as string;
    return await this.mediaService.create({ ...body, userId });
  }

  @Get()
  @ApiOperation({
    summary: 'Get all media (paginated)',
    description:
      'Retrieves all media entries with pagination. Public endpoint. Throws 404 if no media is found.',
  })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of media.',
    schema: {
      example: {
        data: [
          {
            id: 'uuid',
            title: 'Example media',
            description: 'Example description',
            thumbnailUrl: 'https://example.com/thumb.png',
            contentUrl: 'https://example.com/content.mp4',
            mediaCategory: 'VIDEO',
            user: {
              id: 'uuid',
              username: 'john_doe',
              email: 'john@example.com',
              accountType: 'USER',
              createdAt: '2025-01-01T00:00:00Z',
              updatedAt: '2025-01-01T00:00:00Z',
            },
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
          },
        ],
        currentPage: 1,
        total: 25,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'No media found.' })
  async findAll(
    @Query() query: FindAllMediaDto,
  ): Promise<IReturnPaginatedMedia> {
    return await this.mediaService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get media details',
    description:
      'Fetches a single media item by its ID. Throws 404 if the media is not found.',
  })
  @ApiParam({ name: 'id', description: 'Media ID (UUID v4)', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Media found successfully.',
    schema: {
      example: {
        id: 'uuid',
        title: 'Example media',
        description: 'Example description',
        thumbnailUrl: 'https://example.com/thumb.png',
        contentUrl: 'https://example.com/content.mp4',
        mediaCategory: 'GAME',
        user: {
          id: 'uuid',
          username: 'john_doe',
          email: 'john@example.com',
          accountType: 'USER',
        },
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Media not found.' })
  async findOne(@Param() params: FindOneMediaDto) {
    return await this.mediaService.findOne(params);
  }

  @Put(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.USER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update media details',
    description:
      'Updates a media entry. Users can only update their own media; Admins can update any media.',
  })
  @ApiParam({ name: 'id', description: 'Media ID (UUID v4)', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Media updated successfully.',
    schema: {
      example: {
        id: 'uuid',
        title: 'Updated title',
        description: 'Updated description',
        thumbnailUrl: 'https://example.com/thumb.png',
        contentUrl: 'https://example.com/content.mp4',
        mediaCategory: 'ARTWORK',
        userId: 'uuid',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-02T00:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. You can only update your own media.',
  })
  @ApiResponse({ status: 404, description: 'Media not found.' })
  async update(
    @Param() params: FindOneMediaDto,
    @Body() body: UpdateMediaDto,
    @Req() req: IRequest,
  ) {
    return await this.mediaService.update({ ...params, ...body }, req);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.USER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete media',
    description:
      'Deletes a media entry. Users can only delete their own media; Admins can delete any media.',
  })
  @ApiParam({ name: 'id', description: 'Media ID (UUID v4)', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Media deleted successfully.',
    schema: {
      example: {
        id: 'uuid',
        title: 'Deleted media',
        description: 'Example description',
        mediaCategory: 'VIDEO',
        userId: 'uuid',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. You can only delete your own media.',
  })
  @ApiResponse({ status: 404, description: 'Media not found.' })
  async remove(@Param() params: RemoveMediaDto, @Req() req: IRequest) {
    return await this.mediaService.remove(params, req);
  }
}
