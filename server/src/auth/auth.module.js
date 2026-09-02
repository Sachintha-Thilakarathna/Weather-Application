// server/src/auth/auth.module.js
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.auth.guard';
import { MailService } from './mail.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config) => ({
        secret: config.get('JWT_SECRET') || 'weather-app-local-secret',
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthService,
      useFactory: (jwt, cache, mail) => new AuthService(jwt, cache, mail),
      inject: [JwtService, CACHE_MANAGER, MailService],
    },
    {
      provide: JwtAuthGuard,
      useFactory: (jwt) => new JwtAuthGuard(jwt),
      inject: [JwtService],
    },
    {
      provide: MailService,
      useFactory: (config) => new MailService(config),
      inject: [ConfigService],
    },
  ],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}