// server/src/auth/auth.controller.js
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  login(body) {
    // Returns { mfaRequired: true, email } on success, or 401 on bad creds.
    return this.authService.login(body.email, body.password);
  }

  verifyMfa(body) {
    // Returns { accessToken } on success, or 401 on wrong/expired code.
    return this.authService.verifyMfa(body.email, body.code);
  }

  logout() {
    // JWTs here are stateless, so there's nothing to invalidate server-side
    // in this simple setup — this endpoint exists so the frontend has a
    // symmetrical call to make. (See note below on adding a blacklist.)
    return { success: true };
  }
}

Controller('api/auth')(AuthController);
Post('login')(AuthController.prototype, 'login', Object.getOwnPropertyDescriptor(AuthController.prototype, 'login'));
Post('verify-mfa')(AuthController.prototype, 'verifyMfa', Object.getOwnPropertyDescriptor(AuthController.prototype, 'verifyMfa'));
Post('logout')(AuthController.prototype, 'logout', Object.getOwnPropertyDescriptor(AuthController.prototype, 'logout'));
Body()(AuthController.prototype, 'login', 0);
Body()(AuthController.prototype, 'verifyMfa', 0);
Reflect.defineMetadata('design:paramtypes', [AuthService], AuthController);