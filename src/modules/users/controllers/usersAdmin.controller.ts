import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  Put,
  Param,
  Body,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAccessGuard } from 'src/modules/auth/guards/jwt-access.guard';
import { IReturnPaginated } from '../interfaces/returnPaginated.struct';
import { IRequest } from 'src/modules/auth/interfaces/request.struct';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { UsersService } from '../services/users.service';
import { CreateAdminDto } from '../dtos/createAdmin.dto';
import { UpdateAdminDto } from '../dtos/updateAdmin.dto';
import { AccountType } from '../enums/account-type.enum';
import { FindOneDto } from '../dtos/findOne.dto';
import { FindAllDto } from '../dtos/findAll.dto';

@ApiTags('Users (Admin)')
@ApiBearerAuth('access-token')
@Controller('admin/users')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(AccountType.ADMIN)
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user (Admin)',
    description:
      'Admin endpoint to create a new user, with the option to specify `accountType`. Returns the new user object without sensitive data.',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Validation failed.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. JWT Access Token is missing or invalid.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User is not an ADMIN.',
    schema: {
      example: {
        statusCode: 403,
        message:
          'Access denied. This route is allowed only for the following account types: admin.',
        error: 'Forbidden',
      },
    },
  })
  async create(@Body() body: CreateAdminDto) {
    return await this.usersService.create(body);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users (Admin)',
    description:
      'Admin endpoint to fetch all users with pagination. Returns a paginated list of user objects without sensitive data.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Items per page (default: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of users returned successfully.',
    schema: {
      example: {
        data: [
          {
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            profilePictureUrl: 'https://example.com/default-profile.png',
            username: 'admin_user',
            email: 'admin@example.com',
            accountType: 'admin',
            createdAt: '2025-01-01T00:00:00.000Z',
            updatedAt: '2025-01-01T00:00:00.000Z',
            ratingCount: 0,
            lastLogin: null,
          },
        ],
        currentPage: 1,
        total: 1,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. Invalid query parameters (page/limit must be numbers).',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. JWT Access Token is missing or invalid.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User is not an ADMIN.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. No users found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'No users found.',
        error: 'Not Found',
      },
    },
  })
  async findAll(@Query() query: FindAllDto): Promise<IReturnPaginated> {
    return await this.usersService.findAll(query);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update user details (Admin)',
    description:
      "Admin endpoint to update any user's details, including admin-only fields like `accountType`, `ratingCount`, etc.",
  })
  @ApiParam({
    name: 'id',
    description: 'User ID (UUID v4)',
    type: 'string',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. JWT Access Token is missing or invalid.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User is not an ADMIN.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. User with the specified ID not found.',
  })
  async update(
    @Param() params: FindOneDto,
    @Body() body: UpdateAdminDto,
    @Req() req: IRequest,
  ) {
    return await this.usersService.update({ ...params, ...body }, req);
  }
}
