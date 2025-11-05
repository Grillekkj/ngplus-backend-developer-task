import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
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
} from '@nestjs/common';

import { JwtAccessGuard } from 'src/modules/auth/guards/jwt-access.guard';
import { IRequest } from 'src/modules/auth/interfaces/request.struct';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { AccountType } from '../enums/account-type.enum';
import { UsersService } from '../services/users.service';
import { FindOneDto } from '../dtos/findOne.dto';
import { CreateDto } from '../dtos/create.dto';
import { UpdateDto } from '../dtos/update.dto';
import { RemoveDto } from '../dtos/remove.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Public endpoint to register a new user. Hashes the password and saves the user. Returns the new user object without sensitive data.',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. Validation failed (e.g., invalid email, weak password, username already exists).',
    schema: {
      example: {
        statusCode: 400,
        message: [
          {
            property: 'password',
            messages: [
              'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.',
            ],
          },
        ],
        error: 'Bad Request',
      },
    },
  })
  async create(@Body() body: CreateDto) {
    return await this.usersService.create(body);
  }

  @Get(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.USER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get user details',
    description:
      'Fetches a single user by their ID. Requires authentication. Users can only access their own data, unless they are ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID (UUID v4)',
    type: 'string',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @ApiResponse({
    status: 200,
    description: 'User details returned successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid UUID format.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          {
            property: 'id',
            messages: ['The id must be a valid UUID v4.'],
          },
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. JWT Access Token is missing or invalid.',
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden. User is not an ADMIN and is trying to access another user's data.",
    schema: {
      example: {
        statusCode: 403,
        message: 'You can only access your own account.',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. User with the specified ID not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Entry not found.',
        error: 'Not Found',
      },
    },
  })
  async findOne(@Param() params: FindOneDto, @Req() req: IRequest) {
    return await this.usersService.findOne(params, req);
  }

  @Put(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.USER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update user details',
    description:
      "Updates a user's details (username, email, profilePictureUrl). Requires authentication. Users can only update their own data, unless they are ADMIN.",
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
    description:
      'Bad Request. Invalid input data (e.g., invalid email format).',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. JWT Access Token is missing or invalid.',
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden. User is not an ADMIN and is trying to update another user's data.",
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. User with the specified ID not found.',
  })
  async update(
    @Param() params: FindOneDto,
    @Body() body: UpdateDto,
    @Req() req: IRequest,
  ) {
    return await this.usersService.update({ ...params, ...body }, req);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.USER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete a user',
    description:
      'Deletes a user account. Requires authentication. Users can only delete their own account, unless they are ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID (UUID v4)',
    type: 'string',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid UUID format.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. JWT Access Token is missing or invalid.',
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden. User is not an ADMIN and is trying to delete another user's account.",
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. User with the specified ID not found.',
  })
  async remove(@Param() params: RemoveDto, @Req() req: IRequest) {
    return await this.usersService.remove(params, req);
  }
}
