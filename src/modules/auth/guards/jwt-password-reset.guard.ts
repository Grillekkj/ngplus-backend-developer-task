import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtPasswordResetGuard extends AuthGuard('jwt-password-reset') {}
