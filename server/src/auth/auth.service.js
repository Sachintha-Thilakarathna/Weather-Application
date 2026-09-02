// server/src/auth/auth.service.js
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MailService } from './mail.service';

// Hardcoded whitelist for now — matches the assignment's "only whitelisted
// users can log in" requirement. Swap for a real user store later.
const WHITELISTED_USERS = [
  { email: 'careers@fidenz.com', password: 'Pass#fidenz' },
  { email: 'thilakarathnasachintha@gmail.com', password: 'Pass#fidenz' }
];

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

export class AuthService {
  constructor(jwt, cache, mail) {
    this.jwt = jwt;
    this.cache = cache;
    this.mail = mail;
  }

  async login(email, password) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPassword = String(password || '');

    const user = WHITELISTED_USERS.find(
      (u) => u.email === normalizedEmail && u.password === normalizedPassword,
    );

    if (!user) {
      throw new UnauthorizedException('Not authorized');
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    await this.cache.set(`mfa:${normalizedEmail}`, code, OTP_TTL_MS);
    await this.mail.sendOtpEmail(normalizedEmail, code);

    return { mfaRequired: true, email: normalizedEmail };
  }

  async verifyMfa(email, code) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const stored = await this.cache.get(`mfa:${normalizedEmail}`);

    if (!stored || stored !== String(code || '')) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    await this.cache.del(`mfa:${normalizedEmail}`);
    const accessToken = this.jwt.sign({ sub: normalizedEmail });
    return { accessToken };
  }
}

Reflect.defineMetadata('design:paramtypes', [JwtService, Object, MailService], AuthService);