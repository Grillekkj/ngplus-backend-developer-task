import { Controller, Post, UseGuards, Request } from '@nestjs/common';

import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { JwtAccessGuard } from '../guards/jwt-access.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { IRequest } from '../interfaces/request.struct';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: IRequest) {
    return this.authService.signIn(req.user);
  }

  @Post('logout')
  @UseGuards(JwtAccessGuard)
  async logout(@Request() req: IRequest) {
    return this.authService.logout(String(req.user?.userId));
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshTokens(@Request() req: IRequest) {
    const userId = req.user?.userId as string;
    const refreshToken = req.user?.refreshToken as string;
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
