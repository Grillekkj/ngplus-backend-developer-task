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

import { IReturnPaginatedRatings } from '../interfaces/ratings-returnPaginated.struct';
import { JwtAccessGuard } from 'src/modules/auth/guards/jwt-access.guard';
import { AccountType } from 'src/modules/users/enums/account-type.enum';
import { IRequest } from 'src/modules/auth/interfaces/request.struct';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { FindAllRatingsDto } from '../dtos/ratings-findAll.dto';
import { FindOneRatingDto } from '../dtos/ratings-findOne.dto';
import { RatingsService } from '../services/ratings.service';
import { CreateRatingDto } from '../dtos/ratings-create.dto';
import { UpdateRatingDto } from '../dtos/ratings-update.dto';
import { RemoveRatingDto } from '../dtos/ratings-remove.dto';

@ApiTags('Ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.USER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create a rating',
    description:
      'Creates a new rating for a media. Throws 404 if the media does not exist, 403 if the user tries to rate their own media, and 400 if the user already rated it.',
  })
  @ApiResponse({
    status: 201,
    description: 'Created rating object.',
    schema: {
      example: {
        id: 'f3a93094-ec25-46f7-8e2b-fd65a7c99c6b',
        rating: 5,
        userId: '2c08bfb5-7e23-4a58-8b2b-9b28998fd1d0',
        mediaId: '3a11a83f-1e9c-4cf2-a54b-3a03b5b2b9b3',
        createdAt: '2025-11-06T12:34:56.000Z',
        updatedAt: '2025-11-06T12:34:56.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'User already rated this media.' })
  @ApiResponse({ status: 403, description: 'Cannot rate your own media.' })
  @ApiResponse({ status: 404, description: 'Media not found.' })
  async create(
    @Body() body: CreateRatingDto,
    @Req() req: IRequest,
  ): Promise<any> {
    const userId = req.user?.userId as string;
    return await this.ratingsService.create({ ...body, userId });
  }

  @Get()
  @ApiOperation({
    summary: 'Get all ratings (paginated)',
    description:
      'Fetches all ratings with pagination. Can be filtered by mediaId or userId. Throws 404 if none found.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'mediaId',
    required: false,
    type: String,
    description: 'Filter ratings by media ID.',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'Filter ratings by user ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of ratings.',
    schema: {
      example: {
        data: [
          {
            id: 'a0d2d5c3-6b8e-4a3d-8c9a-6f0191b8e6e7',
            rating: 4,
            userId: '9e8b0c6a-0c67-4f45-83a0-5ffcbab6c6a2',
            mediaId: '2e91b7a9-dc60-4edb-a8cf-c3c4f8e7b0b7',
            createdAt: '2025-11-06T12:00:00.000Z',
            updatedAt: '2025-11-06T12:00:00.000Z',
          },
        ],
        currentPage: 1,
        total: 15,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'No ratings found.' })
  async findAll(
    @Query() query: FindAllRatingsDto,
  ): Promise<IReturnPaginatedRatings> {
    return await this.ratingsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single rating',
    description: 'Fetches a single rating by its ID. Throws 404 if not found.',
  })
  @ApiParam({
    name: 'id',
    description: 'Rating ID (UUID v4)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Rating object.',
    schema: {
      example: {
        id: 'c8d2c739-2899-45f2-a21b-1fd2106b8153',
        rating: 3,
        userId: 'e4f1f3b2-1a94-40df-8991-3b59a8ff48e2',
        mediaId: 'b62b08b3-5a45-4c20-bb70-d0cfb98f4d6f',
        createdAt: '2025-11-06T10:15:00.000Z',
        updatedAt: '2025-11-06T10:15:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Rating not found.' })
  async findOne(@Param() params: FindOneRatingDto): Promise<any> {
    return await this.ratingsService.findOne(params);
  }

  @Put(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.USER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update a rating',
    description:
      'Updates a rating by ID. Only the creator or an admin can update it. Throws 403 if unauthorized or 404 if not found.',
  })
  @ApiParam({
    name: 'id',
    description: 'Rating ID (UUID v4)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Updated rating object.',
    schema: {
      example: {
        id: 'c8d2c739-2899-45f2-a21b-1fd2106b8153',
        rating: 4,
        userId: 'e4f1f3b2-1a94-40df-8991-3b59a8ff48e2',
        mediaId: 'b62b08b3-5a45-4c20-bb70-d0cfb98f4d6f',
        createdAt: '2025-11-06T10:15:00.000Z',
        updatedAt: '2025-11-06T12:45:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'You can only update your own rating.',
  })
  @ApiResponse({ status: 404, description: 'Rating not found.' })
  async update(
    @Param() params: FindOneRatingDto,
    @Body() body: UpdateRatingDto,
    @Req() req: IRequest,
  ): Promise<any> {
    return await this.ratingsService.update({ ...params, ...body }, req);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.USER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete a rating',
    description:
      'Deletes a rating by ID. Only the creator or an admin can delete it. Throws 403 if unauthorized or 404 if not found.',
  })
  @ApiParam({
    name: 'id',
    description: 'Rating ID (UUID v4)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted rating object.',
    schema: {
      example: {
        id: 'c8d2c739-2899-45f2-a21b-1fd2106b8153',
        rating: 2,
        userId: 'e4f1f3b2-1a94-40df-8991-3b59a8ff48e2',
        mediaId: 'b62b08b3-5a45-4c20-bb70-d0cfb98f4d6f',
        createdAt: '2025-11-06T10:15:00.000Z',
        updatedAt: '2025-11-06T10:20:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'You can only delete your own rating.',
  })
  @ApiResponse({ status: 404, description: 'Rating not found.' })
  async remove(
    @Param() params: RemoveRatingDto,
    @Req() req: IRequest,
  ): Promise<any> {
    return await this.ratingsService.remove(params, req);
  }
}
