import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_ACCESS_TOKEN_SECRET',
      ) as string,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.userId,
      email: payload.email,
      username: payload.username,
      accountType: payload.accountType,
      jti: payload.jti,
    };
  }
}
