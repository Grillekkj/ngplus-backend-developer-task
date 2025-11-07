import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

import { JwtPasswordResetGuard } from '../guards/jwt-password-reset.guard';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
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

  @Post('reset-password')
  @UseGuards(JwtPasswordResetGuard)
  @ApiBearerAuth('password-reset-token')
  @ApiOperation({
    summary: 'Reset password',
    description:
      'Resets the user password using the token from the reset email and a new password. Returns true and an email if successful, throws NotFoundException if user not found.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password has been reset successfully.',
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. The token is invalid or expired.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async resetPassword(
    @Body() body: ResetPasswordDto,
    @Request() req: IRequest,
  ): Promise<boolean> {
    return this.authService.resetPassword(
      String(req.user?.userId),
      body.password,
    );
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Request password reset',
    description:
      'Initiates password recovery. If the email exists, sends a reset token. Throws NotFoundException if email not found.',
  })
  @ApiResponse({
    status: 204,
    description:
      'Request received. If the email exists, a reset link will be sent.',
  })
  @ApiResponse({
    status: 404,
    description: 'Email not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Entry not found.' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Validation failed (e.g., invalid email).',
  })
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<void> {
    await this.authService.requestPasswordReset(body.email);
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
