import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { JwtAccessGuard } from '../guards/jwt-access.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { IRequest } from '../interfaces/request.struct';
import { AuthService } from '../services/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'User login',
    description:
      'Validates credentials, updates lastLogin, and returns access and refresh tokens. All possible errors from UsersService and password validation are documented.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'john_doe' },
        password: { type: 'string', example: '123456' },
      },
      required: ['username', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successful login, returns access and refresh tokens',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials (wrong password)',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found (entry not found)',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Entry not found.' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async login(@Request() req: IRequest) {
    return this.authService.signIn(req.user);
  }

  @Post('logout')
  @UseGuards(JwtAccessGuard)
  @ApiOperation({
    summary: 'User logout',
    description:
      'Clears the refreshTokenHash in the database for the current user, effectively logging them out.',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    schema: { type: 'boolean', example: true },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Entry not found.' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async logout(@Request() req: IRequest) {
    return this.authService.logout(String(req.user?.userId));
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({
    summary: 'Refresh access and refresh tokens',
    description:
      'Validates the provided refresh token by comparing its hash with the one stored in the database. Generates new access and refresh tokens and updates the refresh token hash. All possible errors are included.',
  })
  @ApiBearerAuth('refresh-token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
      required: ['refreshToken'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns new access and refresh tokens',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description:
      'Access denied if refresh token is invalid or hash does not match',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Access denied' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found for refresh',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Entry not found.' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async refreshTokens(@Request() req: IRequest) {
    const userId = req.user?.userId as string;
    const refreshToken = req.user?.refreshToken as string;
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
