// server/src/auth/mail.service.js
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

export class MailService {
  constructor(config) {
    this.config = config;

    const host = config.get('SMTP_HOST');
    // No SMTP configured -> fall back to logging the code to the console,
    // so MFA is testable locally without real email credentials.
    this.transporter = host
      ? nodemailer.createTransport({
          host,
          port: Number(config.get('SMTP_PORT') || 587),
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASS'),
          },
        })
      : null;
  }

  async sendOtpEmail(to, code) {
    if (!this.transporter) {
      console.log(`[MFA] OTP for ${to}: ${code}`);
      return;
    }

    await this.transporter.sendMail({
      from: this.config.get('SMTP_FROM') || 'no-reply@weather-analytics.app',
      to,
      subject: 'Your verification code',
      text: `Your verification code is ${code}. It expires in 5 minutes.`,
    });
  }
}

Reflect.defineMetadata('design:paramtypes', [ConfigService], MailService);