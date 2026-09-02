// server/src/auth/jwt.auth.guard.js
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class JwtAuthGuard {
  constructor(jwt) {
    this.jwt = jwt;
  }

  canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      request.user = this.jwt.verify(token);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

Reflect.defineMetadata('design:paramtypes', [JwtService], JwtAuthGuard);