import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { StringValue } from 'ms';
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { UsersService } from 'src/modules/users/services/users.service';
import { MailService } from 'src/infra/mail/services/mail.service';
import UsersEntity from 'src/modules/users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne({ username });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        password,
        user.passwordHash,
      );

      if (isPasswordMatching) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, refreshTokenHash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async requestPasswordReset(email: string): Promise<void> {
    const foundEntry = await this.usersService.findOne({ email });

    if (!foundEntry) {
      throw new NotFoundException('Entry not found.');
    }

    const token = this.jwtService.sign(
      { userId: foundEntry.id, email: foundEntry.email },
      {
        secret: this.configService.get<string>(
          'JWT_PASSWORD_RESET_SECRET',
        ) as string,
        expiresIn: this.configService.get<string>(
          'JWT_PASSWORD_RESET_EXPIRATION',
        ) as StringValue,
        jwtid: uuidv4(),
      },
    );

    await this.mailService.sendPasswordResetEmail(
      foundEntry.email,
      foundEntry.username,
      token,
    );
  }

  async resetPassword(userId: string, newPassword: string): Promise<boolean> {
    const foundEntry = await this.usersService.findOne({ id: userId });

    if (!foundEntry) {
      throw new NotFoundException('Entry not found.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.usersService.update({
      id: userId,
      passwordHash: hashedPassword,
      refreshTokenHash: null,
    });

    await this.mailService.sendPasswordResetSuccessEmail(
      foundEntry.email,
      foundEntry.username,
    );

    return true;
  }

  async signIn(
    user: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    await this.usersService.update({ id: user.id, lastLogin: new Date() });
    const tokens = await this._generateTokens(user);
    const refreshTokenPayload = this.jwtService.decode(tokens.refreshToken);
    await this._updateRefreshTokenHash(user.id, refreshTokenPayload.jti);

    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    await this.usersService.update({ id: userId, refreshTokenHash: null });
    return true;
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOne({ id: userId });

    if (!user?.refreshTokenHash) {
      throw new ForbiddenException('Access denied.');
    }

    const oldRefreshTokenPayload = this.jwtService.decode(refreshToken);

    const areTokensMatching = await bcrypt.compare(
      oldRefreshTokenPayload.jti,
      user.refreshTokenHash,
    );

    if (!areTokensMatching) {
      throw new ForbiddenException('Access denied.');
    }

    const tokens = await this._generateTokens(user);
    const newRefreshTokenPayload = this.jwtService.decode(tokens.refreshToken);
    await this._updateRefreshTokenHash(user.id, newRefreshTokenPayload.jti);

    return tokens;
  }

  private async _updateRefreshTokenHash(
    userId: string,
    jti: string,
  ): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(jti, salt);

    await this.usersService.update({
      id: userId,
      refreshTokenHash: hashedRefreshToken,
    });
  }

  private async _generateTokens(
    user: UsersEntity,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const basePayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      accountType: user.accountType,
    };

    const accessToken = this.jwtService.sign({ ...basePayload, jti: uuidv4() });

    const refreshToken = this.jwtService.sign(
      { ...basePayload, jti: uuidv4() },
      {
        secret: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_SECRET',
        ) as string,
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION',
        ) as StringValue,
      },
    );

    return { accessToken, refreshToken };
  }
}
